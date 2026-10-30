import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { apartments, riskFromHsi, riskClasses } from "@/lib/mock-data";
import { usePortfolioStore } from "@/lib/portfolio-store";
import { Thermometer, Download, Share2 } from "lucide-react";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "EPBD Compliance Report — HeatMap.Wohnen" },
      { name: "description", content: "EU Energy Performance of Buildings Directive heat risk assessment documentation." },
    ],
  }),
  component: CompliancePage,
});

function CompliancePage() {
  const scored = usePortfolioStore((s) => s.scored);
  const top5 = [...scored, ...apartments].sort((a, b) => b.hsi - a.hsi).slice(0, 5);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">EPBD Compliance Report</h1>
        <p className="text-muted-foreground mt-1">EU Energy Performance of Buildings Directive — Heat Risk Assessment Documentation</p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden max-w-5xl">
        {/* Document header */}
        <div className="px-10 py-8 border-b border-border bg-gradient-to-b from-muted/30 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-md bg-primary flex items-center justify-center">
                <Thermometer className="size-5 text-primary-foreground" />
              </div>
              <div className="font-bold text-lg">HeatMap<span className="text-accent">.Wohnen</span></div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>Report date: <span className="text-foreground font-medium">June 25, 2025</span></div>
              <div>Report Ref: <span className="text-foreground font-medium">HMW-2025-CTB-0089</span></div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Property Manager</div>
              <div className="font-semibold mt-1">Cottbus Wohnungsverwaltung GmbH</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Portfolio</div>
              <div className="font-semibold mt-1">Central Cottbus District — 847 Units</div>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 space-y-10 text-sm">
          {/* Section A */}
          <section>
            <h2 className="text-base font-bold tracking-tight border-l-4 border-primary pl-3">
              Section A · Executive Heat Risk Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <table className="w-full text-sm border border-border rounded-md overflow-hidden">
                <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                  <tr><th className="px-3 py-2 text-left font-semibold">Risk Band</th><th className="px-3 py-2 text-right font-semibold">Units</th><th className="px-3 py-2 text-right font-semibold">Share</th></tr>
                </thead>
                <tbody>
                  {[
                    ["Low (0–30)", 195, "23%"],
                    ["Moderate (31–60)", 263, "31%"],
                    ["High (61–80)", 237, "28%"],
                    ["Critical (81–100)", 152, "18%"],
                  ].map(([band, n, pct]) => (
                    <tr key={band as string} className="border-t border-border">
                      <td className="px-3 py-2">{band}</td>
                      <td className="px-3 py-2 text-right font-semibold">{n}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="space-y-2">
                <KV k="Overall portfolio HSI" v="58 / 100 (Moderate–High)" />
                <KV k="Units requiring immediate action" v="124" />
                <KV k="Recommended budget — priority retrofits" v="€42,300 – €89,000" />
                <KV k="Projected CO₂ saving" v="187 tonnes / year" />
              </div>
            </div>
          </section>

          {/* Section B */}
          <section>
            <h2 className="text-base font-bold tracking-tight border-l-4 border-primary pl-3">Section B · Methodology</h2>
            <p className="text-foreground/85 leading-relaxed mt-3">
              Heat Stress Index calculated using weighted combination of DWD Klimaatlas climate data,
              OpenStreetMap building orientation data, floor-level analysis, and building-era insulation
              standards (DIN 4108-2, WSchVO 1977, GEG 2020).
            </p>
            <div className="mt-3 px-4 py-3 rounded-md bg-muted font-mono text-xs">
              HSI = (Climate × 0.35) + (Orientation × 0.25) + (Floor × 0.20) + (Building Age × 0.20)
            </div>
          </section>

          {/* Section C */}
          <section>
            <h2 className="text-base font-bold tracking-tight border-l-4 border-primary pl-3">
              Section C · Top Priority Units for Immediate Retrofit
            </h2>
            <table className="w-full text-sm border border-border rounded-md overflow-hidden mt-4">
              <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Address</th>
                  <th className="px-3 py-2 text-left font-semibold">Floor</th>
                  <th className="px-3 py-2 text-right font-semibold">HSI</th>
                  <th className="px-3 py-2 text-left font-semibold">Risk</th>
                  <th className="px-3 py-2 text-left font-semibold">Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {top5.map((a) => {
                  const r = riskFromHsi(a.hsi);
                  return (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-3 py-2 font-medium">{a.address}</td>
                      <td className="px-3 py-2 text-muted-foreground">{a.floor}</td>
                      <td className="px-3 py-2 text-right font-bold">{a.hsi}</td>
                      <td className="px-3 py-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${riskClasses(r)}`}>{r.toUpperCase()}</span></td>
                      <td className="px-3 py-2">{a.topRetrofit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 max-w-5xl">
        <button className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition">
          <Download className="size-4" /> Download PDF Report
        </button>
        <button className="px-5 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm inline-flex items-center gap-2 hover:bg-accent/90 transition">
          <Share2 className="size-4" /> Share with Municipality
        </button>
      </div>
    </AppLayout>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border py-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold text-right">{v}</span>
    </div>
  );
}