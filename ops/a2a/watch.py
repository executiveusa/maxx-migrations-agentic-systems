#!/usr/bin/env python3
"""Read-only MAXX PR mailbox watchdog. No LLM, writes, deployments, or secrets output."""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

PROJECT_ID = "executiveusa/maxx-migrations-agentic-systems:macs-client-zero"
KNOWN_PROTOCOLS = {
    "a2a-handoff/1", "a2a-ack/1", "a2a-status/1", "a2a-controller/1",
    "a2a-review/1", "a2a-blocked/1", "a2a-approval/1", "a2a-complete/1",
}
TRUSTED_ASSOCIATIONS = {"OWNER", "MEMBER", "COLLABORATOR"}


def parse_message(body: str) -> dict | None:
    """Parse only a fenced, schema-identified message; never execute its contents."""
    for match in re.finditer(r"```(?:json)?\s*(\{.*?\})\s*```", body or "", re.S):
        try:
            data = json.loads(match.group(1))
        except (json.JSONDecodeError, TypeError):
            continue
        if (
            isinstance(data, dict)
            and data.get("project_id") == PROJECT_ID
            and data.get("protocol") in KNOWN_PROTOCOLS
            and isinstance(data.get("message_id"), str)
            and data["message_id"]
        ):
            return data
    return None


def parse_time(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
    except ValueError:
        return None


def age_minutes(value: str | None, now: datetime) -> int | None:
    dt = parse_time(value)
    return max(0, int((now - dt).total_seconds() // 60)) if dt else None


def api_get(path: str, token: str) -> object:
    base = os.environ.get("GITHUB_API_URL", "https://api.github.com").rstrip("/")
    if not path.startswith("/") or ".." in path:
        raise ValueError("Invalid API path")
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "maxx-a2a-readonly-watch/1",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = "Bearer " + token
    request = urllib.request.Request(base + path, headers=headers, method="GET")
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)


def fetch_comments(repo: str, number: int, token: str) -> list[dict]:
    comments = []
    for page in range(1, 6):
        batch = api_get(f"/repos/{repo}/issues/{number}/comments?per_page=100&page={page}", token)
        if not isinstance(batch, list):
            raise ValueError("Unexpected GitHub comments response")
        comments.extend(c for c in batch if isinstance(c, dict))
        if len(batch) < 100:
            return comments
    raise RuntimeError("More than 500 comments: increase pagination before trusting cursor")


def summarize(pr: dict, comments: list[dict], now: datetime) -> dict:
    """Report claims separately from verified worker or model execution."""
    messages = []
    for comment in comments:
        parsed = parse_message(comment.get("body") or "")
        if not parsed:
            continue
        messages.append({
            "protocol": parsed["protocol"],
            "message_id": parsed["message_id"],
            "sender": parsed.get("sender"),
            "author": (comment.get("user") or {}).get("login"),
            "author_association": comment.get("author_association"),
            "created_at": comment.get("created_at"),
            "trusted_github_collaborator": comment.get("author_association") in TRUSTED_ASSOCIATIONS,
        })
    acks = [
        m for m in messages
        if m["protocol"] == "a2a-ack/1"
        and m["trusted_github_collaborator"]
        and m["sender"] == "instinct-execution-owner"
    ]
    instinct = [
        m for m in messages
        if m["protocol"] in {"a2a-ack/1", "a2a-status/1", "a2a-complete/1", "a2a-blocked/1"}
        and m["trusted_github_collaborator"]
        and m["sender"] == "instinct-execution-owner"
    ]
    controller = [
        m for m in messages
        if m["protocol"] == "a2a-controller/1" and m["trusted_github_collaborator"]
    ]
    last_instinct = max((m["created_at"] for m in instinct if m["created_at"]), default=None)
    last_controller = max((m["created_at"] for m in controller if m["created_at"]), default=None)
    head = pr.get("head") or {}
    return {
        "schema_version": "1",
        "project_id": PROJECT_ID,
        "checked_at": now.isoformat().replace("+00:00", "Z"),
        "watch_type": "deterministic_read_only_github_actions",
        "pr_url": pr.get("html_url"),
        "pr_state": pr.get("state"),
        "pr_draft": pr.get("draft"),
        "head_sha": head.get("sha"),
        "head_updated_at": pr.get("updated_at"),
        "github_comments_seen": len(comments),
        "structured_messages_seen": len(messages),
        "instinct": {
            "trusted_github_ack_claims": len(acks),
            "last_claimed_activity_at": last_instinct,
            "minutes_since_claimed_activity": age_minutes(last_instinct, now),
            "acknowledged_by_verified_instinct_transport": False,
            "ten_minute_worker_verified": False,
            "needs_attention": not bool(acks) or (age_minutes(last_instinct, now) or 999999) > 30,
        },
        "chatgpt_controller": {
            "last_github_controller_comment_at": last_controller,
            "minutes_since_github_controller_comment": age_minutes(last_controller, now),
            "ten_minute_model_invocation_verified": False,
            "hourly_automation_is_separate": True,
        },
        "scope": {
            "reads_only": True,
            "new_paid_infrastructure_usd": 0,
            "production_deployment_permitted": False,
            "real_client_data_permitted": False,
        },
        "warning": (
            "GitHub cron is best-effort and may be delayed. This checks PR activity, "
            "not whether either AI model actually executed. Instinct ACK is a claim "
            "until authenticated transport and scheduler evidence are independently verified."
        ),
    }


def main() -> int:
    repo = os.environ.get("A2A_REPOSITORY", "executiveusa/maxx-migrations-agentic-systems")
    number = int(os.environ.get("A2A_PR_NUMBER", "37"))
    if repo != "executiveusa/maxx-migrations-agentic-systems" or number != 37:
        raise ValueError("Refusing to monitor a different mailbox without review")
    token = os.environ.get("GITHUB_TOKEN", "")
    now = datetime.now(timezone.utc)
    try:
        pr = api_get(f"/repos/{repo}/pulls/{number}", token)
        if not isinstance(pr, dict):
            raise ValueError("Unexpected PR response")
        comments = fetch_comments(repo, number, token)
        result = summarize(pr, comments, now)
    except (urllib.error.HTTPError, urllib.error.URLError, ValueError, RuntimeError) as exc:
        print("A2A watcher could not read the PR mailbox: " + type(exc).__name__, file=sys.stderr)
        return 1
    Path("maxx-a2a-watch.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    status = "AWAITING_ACK" if result["instinct"]["trusted_github_ack_claims"] == 0 else "ACK_CLAIMED_UNVERIFIED"
    summary = (
        "## MAXX Client Zero — 10-minute PR watch\n\n"
        f"- Checked UTC: {result['checked_at']}\n"
        f"- PR: {result['pr_url']}\n"
        f"- Current PR head: {result['head_sha']}\n"
        f"- Instinct: **{status}** (last claim: {result['instinct']['last_claimed_activity_at'] or 'none'})\n"
        f"- Controller GitHub comment: {result['chatgpt_controller']['last_github_controller_comment_at'] or 'none'}\n"
        "- This is a deterministic read-only monitor; it does not run ChatGPT or Instinct.\n"
        "- GitHub Actions scheduled runs may be delayed.\n"
    )
    print(summary)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as out:
            out.write(summary)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
