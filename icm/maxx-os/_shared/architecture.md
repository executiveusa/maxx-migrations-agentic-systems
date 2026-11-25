# MAXX Architecture — one mental model

## The one architecture to learn

```text
DOOR
  AGENTS.md
    ↓
MAP
  CONTEXT.md
    ↓
WORK
  01_orient
  02_plan
  03_work
  04_verify
  05_release
  06_learn
    ↓
RULES
  _shared/
    ↓
RUNTIME
  code, APIs, databases, queues, agents, providers
```

ICM governs how humans and agents understand and operate the system. Runtime software still does real-time serving, concurrency, queues, integrations, storage, and execution.

## Three-repository federation

```text
macsdigitalmedia
  public story, proof, intake
        ↓
macs-agent-portal
  Stacy conversation, approvals, operator UX
        ↓
maxx-migrations-agentic-systems
  canonical business context, policies, workflows, evidence, execution contracts
```

Do not create a fourth control plane or a second business brain.

## Local rule

Each repository may have local implementation context, but durable business truth belongs to its canonical owner and should be linked, not copied.

## Runtime rule

API, CLI, MCP, voice, browser, and other interfaces are replaceable doors into the same governed system. They do not create separate architectures.
