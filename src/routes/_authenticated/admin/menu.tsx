import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toDateKey } from "@/lib/cutoff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/menu")({
  component: MenuAdmin,
});

type Meal = "lunch" | "dinner";

function MenuAdmin() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(toDateKey(new Date()));

  const { data, isLoading } = useQuery({
    queryKey: ["admin-menu", date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("meal, dishes, descriptor")
        .eq("menu_date", date);
      if (error) throw error;
      const out: Record<Meal, { dishes: string; descriptor: string }> = {
        lunch: { dishes: "", descriptor: "" },
        dinner: { dishes: "", descriptor: "" },
      };
      (data ?? []).forEach((r) => {
        out[r.meal as Meal] = { dishes: r.dishes ?? "", descriptor: r.descriptor ?? "" };
      });
      return out;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Menu Management</h1>
        <p className="text-sm text-muted-foreground">Set the lunch and dinner menu for any date.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="grid max-w-xs gap-1.5">
          <Label htmlFor="menu-date">Menu Date</Label>
          <input
            id="menu-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {isLoading || !data ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <MealEditor
            meal="lunch"
            date={date}
            initial={data.lunch}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin-menu", date] })}
          />
          <MealEditor
            meal="dinner"
            date={date}
            initial={data.dinner}
            onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin-menu", date] })}
          />
        </div>
      )}
    </div>
  );
}

function MealEditor({
  meal,
  date,
  initial,
  onSaved,
}: {
  meal: Meal;
  date: string;
  initial: { dishes: string; descriptor: string };
  onSaved: () => void;
}) {
  const [dishes, setDishes] = useState(initial.dishes);
  const [descriptor, setDescriptor] = useState(initial.descriptor);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!dishes.trim()) {
      toast.error("Please enter the dishes.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("menu_items").upsert(
      {
        menu_date: date,
        meal,
        weekday: new Date(date).getDay(),
        dishes: dishes.trim(),
        descriptor: descriptor.trim() || null,
      },
      { onConflict: "menu_date,meal" },
    );
    setSaving(false);
    if (error) {
      toast.error("Save failed: " + error.message);
      return;
    }
    toast.success(`${meal} menu saved`);
    onSaved();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="flex items-center gap-2 font-serif text-xl font-bold capitalize text-foreground">
        {meal === "lunch" ? (
          <Sun className="h-5 w-5 text-primary" />
        ) : (
          <Moon className="h-5 w-5 text-terracotta" />
        )}
        {meal}
      </h2>
      <div className="mt-4 space-y-4">
        <div className="grid gap-1.5">
          <Label>Dishes</Label>
          <Input
            value={dishes}
            onChange={(e) => setDishes(e.target.value)}
            placeholder="Dal Tadka, Mix Veg, Rice, Roti, Salad"
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Descriptor (optional)</Label>
          <Input
            value={descriptor}
            onChange={(e) => setDescriptor(e.target.value)}
            placeholder="Comforting & Balanced"
          />
        </div>
        <Button variant="mustard" onClick={save} disabled={saving} className="w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save {meal}
        </Button>
      </div>
    </div>
  );
}
