import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { opportunities, pipeline } from "@/lib/mock-data/pipeline";

export function PipelineSnapshot() {
  return (
    <Card>
      <CardHeader
        title="Pipeline"
        description={pipeline.name}
        action={<Link href="/app/pipeline" className="text-sm text-accent">Open pipeline</Link>}
      />
      <div className="grid grid-cols-5 gap-2 text-center">
        {pipeline.stages.map((stage) => {
          const stageOpps = opportunities.filter((o) => o.stageId === stage.id);
          return (
            <div key={stage.id} className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted">{stage.name}</p>
              <p className="mt-1 font-display text-xl font-semibold text-text">{stageOpps.length}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
