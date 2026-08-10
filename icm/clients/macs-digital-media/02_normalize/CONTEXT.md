# CONTEXT.md — 02 Normalize

## Inputs
- approved Stage 01 intake record
- intake question-bank ICM destinations

## Process
Compile answers into ICM buckets plus ontology seeds: entities, relationships, states, events, policies, decisions, metrics, and evidence pointers.

## Outputs
- `icm` JSON
- `ontology` JSON
- unresolved material questions

## Human check
Reject duplicated facts, invented relationships, and unsupported certainty. One fact gets one authoritative home.
