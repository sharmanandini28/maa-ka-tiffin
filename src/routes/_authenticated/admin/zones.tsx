import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminZonesQueryOptions, type AdminZone } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/zones")({
  component: ZonesPage,
});

function ZonesPage() {
  const qc = useQueryClient();
  const { data: zones = [], isLoading } = useQuery(adminZonesQueryOptions);
  const [newSector, setNewSector] = useState("");
  const [adding, setAdding] = useState(false);

  async function addZone() {
    const sector = newSector.trim();
    if (sector.length < 2) {
      toast.error("Enter a sector name.");
      return;
    }
    setAdding(true);
    const { error } = await supabase.from("delivery_zones").insert({
      sector,
      sort_order: zones.length + 1,
    } as never);
    setAdding(false);
    if (error) {
      toast.error("Could not add: " + error.message);
      return;
    }
    setNewSector("");
    toast.success("Sector added");
    qc.invalidateQueries({ queryKey: ["admin-zones"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Delivery Zones</h1>
        <p className="text-sm text-muted-foreground">
          Manage which sectors you serve, fees, minimums and COD availability.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="grid flex-1 gap-1.5">
          <Label htmlFor="new-sector">Add a new sector / area</Label>
          <Input
            id="new-sector"
            value={newSector}
            onChange={(e) => setNewSector(e.target.value)}
            placeholder="e.g. Sector 50"
          />
        </div>
        <Button variant="mustard" onClick={addZone} disabled={adding}>
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add sector
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {zones.map((z) => (
            <ZoneCard
              key={z.id}
              zone={z}
              onChanged={() => qc.invalidateQueries({ queryKey: ["admin-zones"] })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ZoneCard({ zone, onChanged }: { zone: AdminZone; onChanged: () => void }) {
  const [draft, setDraft] = useState(zone);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(zone), [zone]);

  const dirty =
    draft.active !== zone.active ||
    draft.delivery_fee !== zone.delivery_fee ||
    draft.min_qty !== zone.min_qty ||
    draft.meals !== zone.meals ||
    draft.subscription_only !== zone.subscription_only ||
    draft.cod_allowed !== zone.cod_allowed;

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("delivery_zones")
      .update({
        active: draft.active,
        delivery_fee: draft.delivery_fee,
        min_qty: draft.min_qty,
        meals: draft.meals,
        subscription_only: draft.subscription_only,
        cod_allowed: draft.cod_allowed,
      } as never)
      .eq("id", zone.id);
    setSaving(false);
    if (error) {
      toast.error("Save failed: " + error.message);
      return;
    }
    toast.success(`${zone.sector} updated`);
    onChanged();
  }

  async function remove() {
    const { error } = await supabase.from("delivery_zones").delete().eq("id", zone.id);
    if (error) {
      toast.error("Delete failed: " + error.message);
      return;
    }
    toast.success(`${zone.sector} removed`);
    onChanged();
  }

  return (
    <div
      className={`rounded-2xl border bg-card p-5 ${draft.active ? "border-border" : "border-dashed border-border opacity-80"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-foreground">
          <MapPin className="h-4 w-4 text-primary" /> {zone.sector}
        </h3>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          {draft.active ? "Active" : "Inactive"}
          <Switch
            checked={draft.active}
            onCheckedChange={(v) => setDraft({ ...draft, active: v })}
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label className="text-xs">Delivery fee (₹)</Label>
          <Input
            type="number"
            min={0}
            value={draft.delivery_fee}
            onChange={(e) =>
              setDraft({ ...draft, delivery_fee: Math.max(0, Number(e.target.value)) })
            }
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs">Min order qty</Label>
          <Input
            type="number"
            min={1}
            value={draft.min_qty}
            onChange={(e) => setDraft({ ...draft, min_qty: Math.max(1, Number(e.target.value)) })}
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-xs">Available meals</Label>
          <Select value={draft.meals} onValueChange={(v) => setDraft({ ...draft, meals: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Lunch + Dinner</SelectItem>
              <SelectItem value="lunch">Lunch only</SelectItem>
              <SelectItem value="dinner">Dinner only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col justify-end gap-2 pb-1 text-sm">
          <label className="flex items-center justify-between">
            <span className="text-muted-foreground">COD allowed</span>
            <Switch
              checked={draft.cod_allowed}
              onCheckedChange={(v) => setDraft({ ...draft, cod_allowed: v })}
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-muted-foreground">Subscription only</span>
            <Switch
              checked={draft.subscription_only}
              onCheckedChange={(v) => setDraft({ ...draft, subscription_only: v })}
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" variant="mustard" onClick={save} disabled={!dirty || saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
        <Button size="sm" variant="ghost" className="ml-auto text-destructive" onClick={remove}>
          <Trash2 className="h-4 w-4" /> Remove
        </Button>
      </div>
    </div>
  );
}
