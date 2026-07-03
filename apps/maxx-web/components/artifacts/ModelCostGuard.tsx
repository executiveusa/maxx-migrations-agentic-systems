"use client";

import { Card } from "@/components/ui/Card";
import type { AiAgent } from "@/lib/types/agents";

export function ModelCostGuard({ agents }: { agents: AiAgent[] }) {
  const totalBudget = agents.reduce((sum, a) => sum + a.monthlyBudgetUsd, 0);
  const totalSpend = agents.reduce((sum, a) => sum + a.monthlySpendUsd, 0);
  const overBudget = agents.filter((a) => a.monthlySpendUsd >= a.monthlyBudgetUsd);

  return (
    <Card>
      <h3 className="mb-4 font-display text-lg font-semibold text-text">Model cost guard</h3>
      <div className="mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Total spend this month</span>
          <span className="text-text">${totalSpend.toFixed(2)} / ${totalBudget}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-surface-2" role="progressbar" aria-valuenow={Math.round((totalSpend / totalBudget) * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`h-2 rounded-full ${totalSpend / totalBudget > 0.9 ? "bg-red-400" : "bg-accent"}`}
            style={{ width: `${Math.min(100, (totalSpend / totalBudget) * 100)}%` }}
          />
        </div>
      </div>
      {overBudget.length === 0 ? (
        <p className="text-sm text-muted">All agents are within their monthly budget.</p>
      ) : (
        <ul className="space-y-1">
          {overBudget.map((agent) => (
            <li key={agent.id} className="text-sm text-red-400">
              {agent.name} has reached its ${agent.monthlyBudgetUsd} monthly budget.
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
