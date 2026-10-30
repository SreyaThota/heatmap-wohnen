import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { apartments, riskFromHsi, riskClasses } from "@/lib/mock-data";
import { AlertTriangle, Wrench, TrendingUp, Building2, ArrowRight, Sun, Home, Layers } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — HeatMap.Wohnen" },
      { name: "description", content: "Portfolio-wide heat stress overview for German apartment buildings." },
    ],
  }),
  component: Index,
});

const stats = [
  { label: "Total Apartments Scored", value: "847", icon: Building2, tone: "default" as const, sub: "Across 12 buildings" },
  { label: "High Risk Units (HSI > 70)", value: "124", icon: AlertTriangle, tone: "danger" as const, sub: "14.6% of portfolio" },
  { label: "Retrofits Recommended", value: "89", icon: Wrench, tone: "default" as const, sub: "Priority interventions" },
  { label: "Avg Portfolio HSI", value: "58", icon: TrendingUp, tone: "default" as const, sub: "Moderate-High overall" },
];

const distribution = [
  { label: "Low (0–30)", value: 23, color: "bg-risk-low" },
  { label: "Moderate (31–60)", value: 31, color: "bg-risk-moderate" },
  { label: "High (61–80)", value: 28, color: "bg-risk-high" },
  { label: "Critical (81–100)", value: 18, color: "bg-risk-critical" },
];

const actions = [
  { icon: Sun, title: "Install exterior blinds", detail: "Raffstores — south & south-west facing units", count: 34 },
  { icon: Home, title: "Roof insulation upgrade", detail: "Dachgeschoss apartments built pre-1979", count: 18 },
  { icon: Layers, title: "Reflective window film", detail: "Quick win for moderate-risk units", count: 29 },
];

function Index() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mt-1">Live heat risk overview · Cottbus Central District · Updated 25 June 2025</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          const danger = s.tone === "danger";
          return (
            <div key={s.label} className="bg-card rounded-xl p-5 border border-border shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</div>
                <div className={`size-8 rounded-lg flex items-center justify-center ${danger ? "bg-risk-high-bg text-risk-high" : "bg-primary-soft text-primary"}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className={`mt-3 text-3xl font-bold ${danger ? "text-risk-high" : ""}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="font-semibold text-lg">Portfolio Heat Risk Map</h2>
              <p className="text-xs text-muted-foreground">Tap a unit to view its full heat stress breakdown</p>
            </div>
            <Link to="/portfolio" className="text-sm text-accent font-medium hover:underline">View all 847 →</Link>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[640px] overflow-y-auto">
            {apartments.map((a) => {
              const risk = riskFromHsi(a.hsi);
              return (
                <div key={a.id} className="rounded-lg border border-border p-4 hover:border-accent/60 hover:shadow-sm transition">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-semibold text-sm leading-snug">{a.address}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskClasses(risk)}`}>
                      {a.hsi}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{a.floor}</div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded ${riskClasses(risk)}`}>
                      {risk === "Low" ? "Low Risk" : risk === "Moderate" ? "Moderate" : risk === "High" ? "High Risk" : "Critical"}
                    </span>
                    <Link to="/score" className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                      View Details <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-semibold text-lg">HSI Distribution</h2>
            <p className="text-xs text-muted-foreground mb-5">Share of portfolio per risk band</p>
            <div className="space-y-3">
              {distribution.map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground/80">{d.label}</span>
                    <span className="font-semibold">{d.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${d.color}`} style={{ width: `${d.value * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-semibold text-lg">Top 3 Priority Actions</h2>
            <p className="text-xs text-muted-foreground mb-4">Highest-impact retrofits this season</p>
            <ol className="space-y-3">
              {actions.map((a, i) => {
                const Icon = a.icon;
                return (
                  <li key={a.title} className="flex gap-3">
                    <div className="size-9 shrink-0 rounded-lg bg-accent-soft text-accent flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className="size-3.5 text-primary" /> {a.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{a.detail}</div>
                      <div className="text-xs font-medium text-primary mt-0.5">{a.count} apartments</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
