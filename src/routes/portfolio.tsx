import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { apartments, riskFromHsi, riskClasses } from "@/lib/mock-data";
import { usePortfolioStore } from "@/lib/portfolio-store";
import { Search } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio Overview — HeatMap.Wohnen" },
      { name: "description", content: "Full portfolio view of all scored apartments and recommended retrofits." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const [risk, setRisk] = useState("All");
  const [era, setEra] = useState("All");
  const [sort, setSort] = useState("HSI Score");
  const [search, setSearch] = useState("");
  const scored = usePortfolioStore((s) => s.scored);

  const rows = useMemo(() => {
    let r = [...scored, ...apartments];
    if (risk !== "All") r = r.filter((a) => riskFromHsi(a.hsi) === risk);
    if (era === "Pre-1979") r = r.filter((a) => a.buildingYear < 1980);
    if (era === "1980-2015") r = r.filter((a) => a.buildingYear >= 1980 && a.buildingYear <= 2015);
    if (era === "Post-2016") r = r.filter((a) => a.buildingYear > 2015);
    if (search.trim()) r = r.filter((a) => a.address.toLowerCase().includes(search.toLowerCase()));
    if (sort === "HSI Score") r.sort((a, b) => b.hsi - a.hsi);
    if (sort === "Address") r.sort((a, b) => a.address.localeCompare(b.address));
    if (sort === "Floor") r.sort((a, b) => a.floor.localeCompare(b.floor));
    return r;
  }, [risk, era, sort, search, scored]);

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Overview</h1>
        <p className="text-muted-foreground mt-1">
          124 high-risk units require action before summer 2025
          {scored.length > 0 && <span className="ml-2 text-primary font-medium">· {scored.length} newly scored this session</span>}
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
        <Select label="Filter by Risk Level" value={risk} onChange={setRisk} options={["All", "Low", "Moderate", "High", "Critical"]} />
        <Select label="Filter by Building Year" value={era} onChange={setEra} options={["All", "Pre-1979", "1980-2015", "Post-2016"]} />
        <Select label="Sort by" value={sort} onChange={setSort} options={["HSI Score", "Address", "Floor"]} />
        <div className="ml-auto relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search address..."
            className="pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background w-64 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Address</th>
                <th className="px-4 py-3 font-semibold">Floor</th>
                <th className="px-4 py-3 font-semibold">Orientation</th>
                <th className="px-4 py-3 font-semibold">Year</th>
                <th className="px-4 py-3 font-semibold">HSI</th>
                <th className="px-4 py-3 font-semibold">Risk</th>
                <th className="px-4 py-3 font-semibold">Top Retrofit</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const r = riskFromHsi(a.hsi);
                return (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{a.address}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.floor.split(" · ")[0]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.orientation}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.buildingYear}</td>
                    <td className="px-4 py-3 font-bold">{a.hsi}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${riskClasses(r)}`}>{r.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.topRetrofit}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to="/score" className="text-xs font-semibold px-2.5 py-1 rounded border border-border hover:bg-muted mr-1">View</Link>
                      <Link to="/score" className="text-xs font-semibold px-2.5 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90">Score</Link>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground text-sm">No apartments match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-muted/40 border-t border-border px-4 py-3 text-xs text-muted-foreground flex flex-wrap gap-4 justify-between">
          <span>Showing {rows.length} of 847 apartments</span>
          <span>Total retrofit budget estimate: <strong className="text-foreground">€42,300 – €89,000</strong></span>
          <span>Avg CO₂ saving if all retrofits completed: <strong className="text-foreground">187 tonnes/year</strong></span>
        </div>
      </div>
    </AppLayout>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span>{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2.5 py-1.5 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}