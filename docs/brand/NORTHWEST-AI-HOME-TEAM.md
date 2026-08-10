# Northwest AI Home Team Strategy

Status: active brand / R&D direction, August 10, 2026.

## Principle

Home team first. Open models first. Business results decide.

MACS / MAXX will not default every customer to the most famous cloud model. We will test open and locally runnable models against the actual work a business needs done, starting with the Pacific Northwest AI ecosystem.

This is not a vendor-loyalty policy. If another model is better for a job, MAXX can route to it. The purpose of starting locally is to test whether serious business value can be delivered with transparent, inspectable technology developed close to home.

## Face-Off 001

### Microsoft Phi
- Candidate: Phi-4-mini through Foundry Local.
- Microsoft describes Phi as an open small-language-model family and states Phi models are available under the MIT License.
- Foundry Local supports on-device inference and can expose local models through SDK / REST patterns.
- Initial hypotheses to test: compact local operation, instruction following, function calling, multilingual owner interaction, cost and latency.

Official sources:
- https://azure.microsoft.com/en-us/products/phi/
- https://learn.microsoft.com/en-us/azure/foundry-local/how-to/how-to-use-foundry-local-cli

### Ai2 Olmo
- Candidate family: Olmo 3 Instruct, with a locally runnable Olmo instruct variant selected for the hardware being tested.
- Ai2 is a Seattle-based nonprofit AI research institute.
- Ai2 describes Olmo as fully open, including model weights, code, data, checkpoints and training details.
- Initial hypotheses to test: instruction following, tool use, inspectability, local deployment, ICM-grounded work and customization.

Official sources:
- https://allenai.org/olmo
- https://docs.allenai.org/latest-releases
- https://docs.allenai.org/quick_start/running_locally

## Business scorecard

Every model should be tested on the same bounded tasks:
1. Business intake normalization.
2. ICM fact retrieval and refusal to invent missing facts.
3. Lead classification and follow-up drafting.
4. Tool selection / function calling.
5. Human-approval boundary compliance.
6. E-commerce / Shopify operator tasks.
7. Summarization of customer and operations data.
8. Long-context business reasoning.
9. Local/offline operation.
10. Latency, memory, hardware and energy requirements.
11. Real operating cost.
12. Failure modes and recovery behavior.

No model wins because of a benchmark headline. The winner is the least complicated model that reliably passes the business requirement.

## Build in public

MAXX Notes should publish:
- test setup,
- hardware,
- prompts / task definitions where safe,
- pass/fail criteria,
- wins,
- failures,
- cost,
- privacy / data path,
- whether the result was useful to a nontechnical owner.

Do not publish proprietary customer data or secrets.

## Northwest community alignment research

### Ai2
Current official work relevant to MACS values includes:
- Wildlands: machine learning and computer vision supporting forest-fuel and wildfire management.
- OlmoEarth: open Earth-observation models and infrastructure used for applications including wildfire risk, food security and deforestation monitoring.
- Fully open model / evaluation infrastructure intended to make AI research more inspectable and reproducible.

Official sources:
- https://allenai.org/wildlands
- https://allenai.org/blog/olmoearth-infrastructure
- https://allenai.org/more-than-open

### Microsoft in Washington
Current official Washington initiatives relevant to MACS values include:
- nonprofit digital transformation,
- AI readiness for schools, districts and community colleges through Microsoft Elevate Washington,
- TechSpark economic-opportunity work in Central Washington,
- affordable-housing investment,
- Cascadia Innovation Corridor work,
- local nonprofit giving and volunteering.

Official source:
- https://www.microsoft.com/en-us/corporate-responsibility/philanthropies/washington-state

## Partnership language rule

Using, testing, linking to or writing about Microsoft or Ai2 technology does **not** make either organization a MACS partner, sponsor or endorser.

Until a formal relationship exists, public language must say:
- `technology we are testing`,
- `open models we use`,
- `community work we are following`,
- `organizations we hope to learn from or collaborate with`.

Do not say `partner`, `official partner`, `supported by`, or `endorsed by` without evidence and approval.

## Economic-locality rule

Running an open model locally does not automatically send money back to the organization or community that created it. If MACS wants the economic benefit to stay local, make that concrete through local hiring, vendors, events, donations, grants, paid collaborations, sponsorships or formal partnerships—and log those separately as verified actions.
