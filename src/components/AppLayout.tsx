import { Link, useRouterState } from "@tanstack/react-router";
import { Thermometer, LayoutDashboard, Calculator, ListChecks, FileText } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/score", label: "Score Apartment", icon: Calculator },
  { to: "/portfolio", label: "Portfolio", icon: ListChecks },
  { to: "/compliance", label: "Compliance Report", icon: FileText },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <aside className="w-64 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
        <div className="px-5 py-6 flex items-center gap-2 border-b border-sidebar-border">
          <div className="size-9 rounded-md bg-primary/90 flex items-center justify-center">
            <Thermometer className="size-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-base tracking-tight">HeatMap<span className="text-accent">.Wohnen</span></div>
            <div className="text-[11px] text-sidebar-muted">Heat Risk Intelligence</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-active text-white font-semibold"
                    : "text-sidebar-foreground/85 hover:bg-sidebar-active/60 hover:text-white"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-sidebar-border space-y-2">
          <div className="text-sm font-semibold">Cottbus Wohnungs­verwaltung GmbH</div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent/15 text-accent">
            Professional Plan · up to 300 units
          </div>
          <a className="block text-xs text-sidebar-muted hover:text-white underline-offset-2 hover:underline cursor-pointer">
            Upgrade for unlimited units →
          </a>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-[1400px] mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}