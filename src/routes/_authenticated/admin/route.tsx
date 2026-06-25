import { createFileRoute, Outlet, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  UtensilsCrossed,
  LogOut,
  Loader2,
  Headphones,
  ClipboardList,
  Wallet,
  MapPin,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { SUPPORT_PHONE_DISPLAY } from "@/lib/brand";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) throw redirect({ to: "/auth" });
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(data) };
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList, exact: false },
  { to: "/admin/payments", label: "Payments", icon: Wallet, exact: false },
  { to: "/admin/zones", label: "Delivery Zones", icon: MapPin, exact: false },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed, exact: false },
] as const;

function AdminLayout() {
  const { isAdmin } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-foreground">Not authorised</h1>
        <p className="max-w-sm text-muted-foreground">
          This account doesn't have admin access. Please sign in with the admin account.
        </p>
        <button
          onClick={handleSignOut}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="border-b border-sidebar-border bg-card px-5 py-4">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
              activeProps={{ className: "bg-mustard text-mustard-foreground hover:bg-mustard" }}
              activeOptions={{ exact: item.exact }}
            >
              <item.icon className="h-5 w-5" /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/70">
            <Headphones className="h-4 w-4" /> {SUPPORT_PHONE_DISPLAY}
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent"
          >
            {signingOut ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <Logo />
          <button onClick={handleSignOut} className="text-sm font-medium text-primary">
            Sign Out
          </button>
        </header>
        <div className="mx-auto max-w-7xl p-4 sm:p-6">
          <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm font-medium"
                activeProps={{ className: "bg-primary text-primary-foreground border-primary" }}
                activeOptions={{ exact: item.exact }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
