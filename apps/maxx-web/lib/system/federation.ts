export const MAXX_FEDERATION_VERSION = "1.0.0";

export const PUBLIC_BUCKETS = ["reset", "momentum", "scale", "launch"] as const;
export type PublicBucket = (typeof PUBLIC_BUCKETS)[number];

export const FEDERATION = {
  system: "MAXX",
  canonicalBackend: "executiveusa/maxx-migrations-agentic-systems",
  operatorSurface: "executiveusa/macs-agent-portal",
  publicStorefront: "executiveusa/macsdigitalmedia",
  icm: {
    method: "Interpretable Context Methodology",
    authority: "docs/icm/ICM_CORE.md",
    humanMachineContract: "docs/icm/HUMAN_MACHINE_CONTRACT.md",
    federationContract: "docs/icm/FEDERATION_CONTRACT.md",
    walkTest: "icm/federation/WALK_TEST.md",
  },
  evidenceStates: ["PROPOSED", "BUILT", "TESTED", "VERIFIED", "ADOPTED", "VALUABLE"],
  publicBuckets: PUBLIC_BUCKETS,
} as const;

export function routeCommercialCondition(condition: string): {
  bucket: PublicBucket;
  reason: string;
} {
  const text = condition.toLowerCase();

  if (/new|launch|first customer|first demand|new offer|new product|new program/.test(text)) {
    return { bucket: "launch", reason: "The work needs market proof or first demand." };
  }
  if (/working|capacity|scale|owner dependence|throughput|repeatab|complexity|volume/.test(text)) {
    return { bucket: "scale", reason: "The idea is working and the constraint is repeatability, capacity, or complexity." };
  }
  if (/attention|content|follow.?up|distribution|lead|pipeline|consisten|momentum|visibility/.test(text)) {
    return { bucket: "momentum", reason: "The offer exists and the constraint is consistent qualified demand or follow-through." };
  }
  return { bucket: "reset", reason: "Start by removing the highest-value leak, friction, breakage, or confusion." };
}
