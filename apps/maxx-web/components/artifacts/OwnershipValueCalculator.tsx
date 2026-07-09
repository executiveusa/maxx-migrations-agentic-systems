"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";

export function OwnershipValueCalculator() {
  const [monthlySaas, setMonthlySaas] = useState(600);
  const [years, setYears] = useState(3);

  const rentedTotal = monthlySaas * 12 * years;
  const sovereignInstall = 8500;
  const partnerRetainer = 250 * 12 * years;
  const sovereignTotal = sovereignInstall + partnerRetainer;
  const savings = rentedTotal - sovereignTotal;

  return (
    <Card>
      <h3 className="mb-4 font-display text-lg font-semibold text-text">Ownership value calculator</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Current monthly SaaS spend (CRM + scheduling + forms)">
          <Input
            type="number"
            min={0}
            value={monthlySaas}
            onChange={(e) => setMonthlySaas(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Time horizon (years)">
          <Input type="number" min={1} max={10} value={years} onChange={(e) => setYears(Number(e.target.value) || 1)} />
        </Field>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 text-center">
        <div>
          <p className="text-xs text-muted">Rented SaaS stack</p>
          <p className="mt-1 font-display text-2xl font-semibold text-text">${rentedTotal.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Sovereign install + partner</p>
          <p className="mt-1 font-display text-2xl font-semibold text-text">${sovereignTotal.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Estimated savings</p>
          <p className={`mt-1 font-display text-2xl font-semibold ${savings >= 0 ? "text-accent" : "text-red-400"}`}>
            ${savings.toLocaleString()}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">
        Estimate only. Actual sovereign install pricing depends on scope — see your migration audit for a firm quote.
      </p>
    </Card>
  );
}
