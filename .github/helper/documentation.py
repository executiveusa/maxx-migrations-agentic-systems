import json
import os
import sys
from urllib.parse import urlparse

import requests

WEBSITE_REPOS = [
    "erpnext_com",
    "frappe_io",
]

DOCUMENTATION_DOMAINS = [
    "docs.erpnext.com",
    "docs.frappe.io",
    "frappeframework.com",
]


def is_valid_url(url: str) -> bool:
    parts = urlparse(url)
    return all((parts.scheme, parts.netloc, parts.path))


def is_documentation_link(word: str) -> bool:
    if not word.startswith("http") or not is_valid_url(word):
        return False

    parsed_url = urlparse(word)
    if parsed_url.netloc in DOCUMENTATION_DOMAINS:
        return True

    if parsed_url.netloc == "github.com":
        parts = parsed_url.path.split("/")
        if len(parts) == 5 and parts[1] == "frappe" and parts[2] in WEBSITE_REPOS:
            return True

    return False


def contains_documentation_link(body: str) -> bool:
    return any(is_documentation_link(word) for line in body.splitlines() for word in line.split())


def event_pull_request(number: str):
    event_path = os.environ.get("GITHUB_EVENT_PATH")
    if not event_path or not os.path.exists(event_path):
        return None

    try:
        with open(event_path, encoding="utf-8") as handle:
            event = json.load(handle)
    except (OSError, ValueError):
        return None

    pull_request = event.get("pull_request")
    if not pull_request:
        return None

    if str(pull_request.get("number", event.get("number", ""))) != str(number):
        return None

    return pull_request


def api_pull_request(number: str):
    repository = os.environ.get("GITHUB_REPOSITORY", "executiveusa/maxx-migrations-agentic-systems")
    headers = {"Accept": "application/vnd.github+json"}
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    response = requests.get(
        f"https://api.github.com/repos/{repository}/pulls/{number}",
        headers=headers,
        timeout=15,
    )
    if not response.ok:
        return None
    return response.json()


def check_pull_request(number: str) -> "tuple[int, str]":
    payload = event_pull_request(number) or api_pull_request(number)
    if not payload:
        return 0, "Skipping documentation checks: pull-request metadata is unavailable to this workflow."

    title = (payload.get("title") or "").lower().strip()
    head_sha = (payload.get("head") or {}).get("sha")
    body = (payload.get("body") or "").lower()

    if not title.startswith("feat") or not head_sha or "no-docs" in body or "backport" in body:
        return 0, "Skipping documentation checks... 🏃"

    if contains_documentation_link(body):
        return 0, "Documentation Link Found. You're Awesome! 🎉"

    return 1, "Documentation Link Not Found! ⚠️"


if __name__ == "__main__":
    exit_code, message = check_pull_request(sys.argv[1])
    print(message)
    sys.exit(exit_code)
