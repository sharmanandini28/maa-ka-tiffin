import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Save, Settings, Wallet } from "lucide-react";
import { toast } from "sonner";
import {
  adminPaymentSettingsQueryOptions,
  updatePaymentSettings,
  type PaymentSettingsPatch,
} from "@/lib/admin-data";
import { PAYMENT_SETTINGS_UNAVAILABLE_MESSAGE } from "@/lib/public.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/admin/payment-settings")({
  component: PaymentSettingsPage,
});

function PaymentSettingsPage() {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useQuery(adminPaymentSettingsQueryOptions);
  const [draft, setDraft] = useState<PaymentSettingsPatch | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setDraft({
      upi_id: settings.upi_id,
      payee_name: settings.payee_name,
      payment_instructions: settings.payment_instructions,
      screenshot_instructions: settings.screenshot_instructions,
      transaction_id_required: settings.transaction_id_required,
      upi_enabled: settings.upi_enabled,
      is_active: true,
    });
  }, [settings]);

  async function save() {
    if (!settings || !draft) return;
    if (draft.upi_enabled && draft.upi_id.trim().length === 0) {
      toast.error("UPI ID is required when UPI payment is enabled.");
      return;
    }
    if (draft.payee_name.trim().length === 0) {
      toast.error("Payee name is required.");
      return;
    }

    setSaving(true);
    try {
      const { auditError } = await updatePaymentSettings(settings, {
        ...draft,
        upi_id: draft.upi_id.trim(),
        payee_name: draft.payee_name.trim(),
        payment_instructions: draft.payment_instructions?.trim() || null,
        screenshot_instructions: draft.screenshot_instructions?.trim() || null,
      });
      toast.success("Payment settings saved");
      if (auditError) toast.warning("Saved, but audit log failed: " + auditError.message);
      await qc.invalidateQueries({ queryKey: ["admin-payment-settings"] });
      await qc.invalidateQueries({ queryKey: ["payment-settings"] });
    } catch (error) {
      toast.error("Save failed: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Payment Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage the active UPI QR destination shown to customers during checkout.
        </p>
      </div>

      {isLoading || !settings || !draft ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : settings.unavailable ? (
        <div className="rounded-2xl border border-terracotta/30 bg-terracotta/10 p-5 text-sm text-foreground">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />
            <div>
              <p className="font-semibold">{PAYMENT_SETTINGS_UNAVAILABLE_MESSAGE}</p>
              <p className="mt-1 text-muted-foreground">
                The order page will keep using the safe placeholder fallback until the migration is
                applied.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-bold text-foreground">Manual UPI QR</h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="upi-id">UPI ID / VPA</Label>
                <Input
                  id="upi-id"
                  value={draft.upi_id}
                  onChange={(e) => setDraft({ ...draft, upi_id: e.target.value })}
                  placeholder="your-upi-id@bank"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="payee-name">Payee name</Label>
                <Input
                  id="payee-name"
                  value={draft.payee_name}
                  onChange={(e) => setDraft({ ...draft, payee_name: e.target.value })}
                  placeholder="Maa Jaisa Tiffin"
                />
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <span>
                  <span className="block font-medium text-foreground">UPI payment active</span>
                  <span className="text-xs text-muted-foreground">Show UPI QR on order page</span>
                </span>
                <Switch
                  checked={draft.upi_enabled}
                  onCheckedChange={(v) => setDraft({ ...draft, upi_enabled: v })}
                />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <span>
                  <span className="block font-medium text-foreground">Transaction ID required</span>
                  <span className="text-xs text-muted-foreground">
                    Screenshot is still required on WhatsApp
                  </span>
                </span>
                <Switch
                  checked={draft.transaction_id_required}
                  onCheckedChange={(v) => setDraft({ ...draft, transaction_id_required: v })}
                />
              </label>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="payment-instructions">Payment instruction text</Label>
                <Textarea
                  id="payment-instructions"
                  value={draft.payment_instructions ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, payment_instructions: e.target.value || null })
                  }
                  rows={4}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="screenshot-instructions">WhatsApp screenshot instruction</Label>
                <Textarea
                  id="screenshot-instructions"
                  value={draft.screenshot_instructions ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, screenshot_instructions: e.target.value || null })
                  }
                  rows={3}
                />
              </div>
            </div>

            <Button className="mt-5" variant="mustard" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save payment settings
            </Button>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Wallet className="h-4 w-4 text-primary" /> Current Active UPI
              </p>
              <p className="mt-3 font-mono text-sm font-bold text-primary">{settings.upi_id}</p>
              <p className="text-sm text-muted-foreground">Payee: {settings.payee_name}</p>
            </div>

            <div className="rounded-2xl border border-mustard/40 bg-mustard/10 p-4 text-xs text-foreground">
              <p className="font-semibold">Public payment info</p>
              <p className="mt-1 text-muted-foreground">
                UPI ID is visible to customers through the QR code. Do not put private secrets here.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
