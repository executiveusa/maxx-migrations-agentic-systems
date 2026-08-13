# Home Team Model Lab

Suite role: `CAPABILITY + BUILD_IN_PUBLIC`.

## Purpose

Test whether Pacific Northwest/open models can perform real MAXX business workflows before defaulting to expensive frontier APIs. The goal is not hometown favoritism; the goal is evidence about privacy, ownership, cost, latency and business usefulness.

## Current candidates — 2026-08-12

### Microsoft / Redmond — Foundry Local + Phi

Official Microsoft documentation now describes Foundry Local as a local model runtime that can be used through Microsoft's Agent Framework. The documented agent integration supports local function tools when the chosen model supports function calling, local MCP tools, and tool approval. Microsoft examples use `phi-4-mini` as a local model. Foundry Local reached GA in 2026 and is positioned for on-device/offline execution.

Primary references:
- https://learn.microsoft.com/en-us/agent-framework/agents/providers/foundry-local
- https://devblogs.microsoft.com/foundry/foundry-local-ga/

### Ai2 / Seattle — OLMo

Ai2's current OLMo 3 family includes 7B/32B Instruct variants designed for instruction following, multi-turn dialogue and tool use, plus fully open model-flow artifacts. Ai2's openness model includes weights, data, code, methods/checkpoints/evaluations rather than API access alone.

Primary references:
- https://allenai.org/olmo
- https://allenai.org/blog/olmo3
- https://allenai.org/blog/who-gets-to-understand-ai

## Face-Off 001

Test the same bounded workflows against appropriate local variants:

1. messy owner intake → structured business context;
2. ICM retrieval with abstention when facts are missing;
3. approved tool selection/function calling;
4. lead classification/follow-up draft;
5. e-commerce/Shopify operator reasoning;
6. summarize research/evidence without inventing claims;
7. policy/approval compliance;
8. recovery from malformed tool output.

Measure:
- task success against deterministic acceptance criteria;
- hallucination/unsupported-claim rate;
- approval-boundary compliance;
- latency;
- memory/RAM/VRAM requirements;
- energy/hardware assumptions where measurable;
- cost per successful workflow;
- local/offline capability;
- portability and license/open-artifact posture;
- whether a nontechnical owner finds the output useful.

## Routing rule

The model is replaceable. MAXX owns the evaluation harness, ICM context, tool contracts, approval rules and evidence. Route each workflow to the smallest/safest/least-complicated model that passes the requirement. Escalate to a larger/cloud model only when evidence shows the local/small model is insufficient.

## Marketing rule

Publish the test setup, wins, misses and costs. Do not call Microsoft or Ai2 a partner unless a formal relationship actually exists. Technology use/testing is not endorsement.
