import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Sun, Layers, Home, FileText, Save, ArrowRight, CheckCircle2, Wind } from "lucide-react";
import {
  BUILDING_OPTIONS, COOLING_OPTIONS, FLOOR_OPTIONS, ORIENTATION_OPTIONS,
  computeScore, recommendRetrofits, inputsToApartment,
  type Building, type Cooling, type Floor, type Orientation,
} from "@/lib/scoring";
import { usePortfolioStore } from "@/lib/portfolio-store";
import { riskClasses, riskSolid } from "@/lib/mock-data";

export const Route = createFileRoute("/score")({
  head: () => ({
    meta: [
      { title: "Score an Apartment — HeatMap.Wohnen" },
      { name: "description", content: "Calculate the Heat Stress Index for any apartment in seconds." },
    ],
  }),
  component: ScorePage,
});

const RETROFIT_ICON: Record<string, typeof Sun> = {
  raffstores: Sun,
  film: Layers,
  roof: Home,
  curtains: Wind,
};

function ScorePage() {
  const [address, setAddress] = useState("Berliner Str. 14, Cottbus");
  const [floor, setFloor] = useState<Floor>("4th Floor");
  const [orientation, setOrientation] = useState<Orientation>("South-West");
  const [building, setBuilding] = useState<Building>("1950s–1970s (Plattenbau)");
  const [cooling, setCooling] = useState<Cooling>("None");
  const [result, setResult] = useState(() => computeScore({ address, floor, orientation, building, cooling }));
  const [saved, setSaved] = useState(false);
  const addToPortfolio = usePortfolioStore((s) => s.add);
  const resultsRef = useRef<HTMLDivElement>(null);

  const inputs = { address, floor, orientation, building, cooling };

  const onCalculate = () => {
    const r = computeScore(inputs);
    setResult(r);
    setSaved(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const onSave = () => {
    addToPortfolio(inputsToApartment(inputs, result.hsi));
    setSaved(true);
  };

  const retrofits = recommendRetrofits(inputs);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Score a New Apartment</h1>
        <p className="text-muted-foreground mt-1">Enter apartment details to calculate the Heat Stress Index</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6 max-w-3xl">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="text-sm font-semibold block mb-1.5">Street Address</label>
            <input
              type="text"
              placeholder="e.g. Berliner Str. 14, Cottbus"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <SelectField label="Floor Level" value={floor} onChange={(v) => setFloor(v as Floor)} options={FLOOR_OPTIONS} />
          <SelectField label="Window Orientation" value={orientation} onChange={(v) => setOrientation(v as Orientation)} options={ORIENTATION_OPTIONS} />
          <SelectField label="Building Construction Year" value={building} onChange={(v) => setBuilding(v as Building)} options={BUILDING_OPTIONS} />
          <SelectField label="Existing Cooling" value={cooling} onChange={(v) => setCooling(v as Cooling)} options={COOLING_OPTIONS} />

          <button
            onClick={onCalculate}
            className="mt-2 w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 inline-flex items-center justify-center gap-2 transition"
          >
            Calculate Heat Stress Index <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div ref={resultsRef} className="mt-10">
          <div className="bg-card rounded-xl border border-border shadow-sm p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex flex-col items-center">
                <div className={`size-36 rounded-full flex items-center justify-center border-8 ${riskClasses(result.risk)} border-current/30`}>
                  <span className="text-5xl font-bold">{result.hsi}</span>
                </div>
                <div className={`mt-3 font-bold tracking-wider text-sm px-3 py-1 rounded ${riskSolid(result.risk)}`}>
                  {result.risk.toUpperCase()} RISK
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{address || "Untitled apartment"}</h2>
                <p className="text-muted-foreground mt-1">{result.interpretation}</p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  HSI = (Climate {result.climate} × 0.35) + (Orientation {result.orientation} × 0.25) + (Floor {result.floor} × 0.20) + (Building {result.building} × 0.20)
                  {result.coolingReduction > 0 ? ` − cooling offset ${(result.coolingReduction * 0.5).toFixed(1)}` : ""}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  {result.factors.map((f) => (
                    <div key={f.label} className="rounded-lg border border-border bg-background p-3">
                      <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{f.label}</div>
                      <div className="text-2xl font-bold mt-1">
                        {f.value}<span className="text-sm font-medium text-muted-foreground"> / 100</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{f.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">Recommended Retrofits</h2>
            <p className="text-sm text-muted-foreground">Ranked by impact-per-euro for this specific unit</p>
            {retrofits.length === 0 && (
              <div className="mt-4 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
                No additional retrofits recommended — this unit already has strong cooling measures in place.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {retrofits.map((r) => {
                const Icon = RETROFIT_ICON[r.key] ?? Sun;
                const impactClass =
                  r.impact === "HIGH"
                    ? "bg-primary text-primary-foreground"
                    : r.impact === "MEDIUM"
                    ? "bg-accent-soft text-accent"
                    : "bg-muted text-muted-foreground";
                return (
                  <div key={r.name} className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="size-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                        <Icon className="size-5" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${impactClass}`}>
                        {r.impact} IMPACT
                      </span>
                    </div>
                    <div className="font-semibold mt-3">{r.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{r.cost}</div>
                    <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary" />
                        <span>Reduces HSI by <strong>{r.reduction} points</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-accent" />
                        <span className="text-muted-foreground">{r.co2}</span>
                      </div>
                    </div>
                    {r.bestValue && (
                      <div className="mt-4 inline-flex self-start items-center gap-1 text-xs font-semibold text-primary bg-primary-soft px-2 py-1 rounded">
                        <CheckCircle2 className="size-3" /> ✓ Best Value
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => alert("EPBD compliance report generated (demo)")}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition"
            >
              <FileText className="size-4" /> Generate EPBD Compliance Report (PDF)
            </button>
            <button
              onClick={onSave}
              className="px-5 py-2.5 rounded-lg bg-muted text-foreground font-semibold text-sm inline-flex items-center gap-2 hover:bg-muted/70 transition border border-border"
            >
              <Save className="size-4" /> {saved ? "Saved to Portfolio ✓" : "Save to Portfolio"}
            </button>
            {saved && <span className="self-center text-sm text-primary font-medium">Now visible in the Portfolio and Compliance Report.</span>}
          </div>
      </div>
    </AppLayout>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div>
      <label className="text-sm font-semibold block mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}