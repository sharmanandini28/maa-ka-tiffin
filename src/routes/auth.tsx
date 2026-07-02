import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, UtensilsCrossed, ServerOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { isSupabaseConfigured, CONFIG_MESSAGES } from "@/lib/config";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "Admin Login — Maa Jaisa Tiffin" }, { name: "robots", content: "noindex" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const allowAdminSignup = import.meta.env.VITE_ALLOW_ADMIN_SIGNUP === "true";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "signup" && !allowAdminSignup) {
      toast.error("Admin signup is disabled. Please contact the site owner.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created. Signing you in...");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
        <Logo className="mb-8" />
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 text-center shadow-lg">
          <ServerOff className="mx-auto h-8 w-8 text-muted-foreground" />
          <h1 className="mt-3 font-serif text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">{CONFIG_MESSAGES.admin}</p>
        </div>
        <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-primary">
          ← Back to website
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
      <Logo className="mb-8" />
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-lg">
        <div className="flex items-center gap-2 text-primary">
          <Lock className="h-5 w-5" />
          <h1 className="font-serif text-2xl font-bold text-foreground">Admin Access</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage your tiffin service."
            : "Create the admin account."}
        </p>
        {!allowAdminSignup && (
          <p className="mt-3 rounded-md border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
            Admin signup is disabled. Please contact the site owner.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@maajaisatiffin.in"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" variant="mustard" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UtensilsCrossed className="h-4 w-4" />
            )}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {allowAdminSignup && (
          <button
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-primary"
          >
            {mode === "signin"
              ? "First time? Create the admin account"
              : "Already have an account? Sign in"}
          </button>
        )}
      </div>
      <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-primary">
        ← Back to website
      </Link>
    </div>
  );
}
