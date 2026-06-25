import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ShoppingBag,
  Check,
  MessageCircle,
  AlertTriangle,
  Clock,
  Loader2,
  PartyPopper,
  Sun,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Wallet,
  ShieldCheck,
  Truck,
  ChefHat,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrder, type OrderResultDTO } from "@/lib/orders.functions";
import { checkCutoff, toDateKey, getCutoffMoment, formatCountdown } from "@/lib/cutoff";
import { zonesQueryOptions } from "@/lib/queries";
import type { ZoneDTO } from "@/lib/public.functions";
import {
  ADD_ONS,
  DAILY_PRICES,
  EXTRA_ROTI_PRICE,
  UPI_ID,
  PLAN_CATALOG,
  SUBSCRIPTION_PLANS,
  type PlanSlug,
  formatINR,
  buildWhatsAppLink,
} from "@/lib/brand";

const searchSchema = z.object({
  plan: z.enum(["basic", "standard", "premium"]).optional(),
});

export const Route = createFileRoute("/order")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Order Tiffin Online — Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "Order home-style lunch or dinner tiffin in Noida in a few guided steps. Choose your plan, delivery date and add-ons. UPI or Cash on Delivery.",
      },
    ],
  }),
  component: OrderPage,
});

type MealChoice = "lunch" | "dinner" | "both";

const STEPS = [
  { id: 0, label: "Meal" },
  { id: 1, label: "Date" },
  { id: 2, label: "Plan" },
  { id: 3, label: "Customize" },
  { id: 4, label: "Delivery" },
  { id: 5, label: "Payment" },
  { id: 6, label: "Review" },
];

function OrderPage() {
  const search = Route.useSearch();
  const createOrderFn = useServerFn(createOrder);
  const [results, setResults] = useState<OrderResultDTO[] | null>(null);

  if (results) {
    return (
      <SiteLayout>
        <Confirmation results={results} onReset={() => setResults(null)} />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <OrderWizard
        initialPlan={search.plan ?? "standard"}
        createOrderFn={createOrderFn}
        onSuccess={setResults}
      />
    </SiteLayout>
  );
}

function OrderWizard({
  initialPlan,
  createOrderFn,
  onSuccess,
}: {
  initialPlan: PlanSlug;
  createOrderFn: (opts: { data: unknown }) => Promise<OrderResultDTO>;
  onSuccess: (r: OrderResultDTO[]) => void;
}) {
  const today = toDateKey(new Date());
  const maxDate = toDateKey(new Date(Date.now() + 7 * 86400000));
  const { data: zones = [] } = useQuery(zonesQueryOptions);

  const [step, setStep] = useState(0);
  const [mealChoice, setMealChoice] = useState<MealChoice>("lunch");
  const [deliveryDate, setDeliveryDate] = useState(today);
  const [plan, setPlan] = useState<PlanSlug>(initialPlan);
  const [quantity, setQuantity] = useState(1);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [spice, setSpice] = useState("normal");
  const [ricePref, setRicePref] = useState(true);
  const [extraRoti, setExtraRoti] = useState(0);
  const [paymentMode, setPaymentMode] = useState<"upi" | "cod">("upi");
  const [upiTxn, setUpiTxn] = useState("");
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [sector, setSector] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [note, setNote] = useState("");

  const meals = useMemo<("lunch" | "dinner")[]>(
    () => (mealChoice === "both" ? ["lunch", "dinner"] : [mealChoice]),
    [mealChoice],
  );

  const cutoffs = useMemo(
    () => meals.map((m) => ({ meal: m, ...checkCutoff(m, deliveryDate) })),
    [meals, deliveryDate],
  );
  const allAllowed = cutoffs.every((c) => c.allowed);
  const isLate = !allAllowed;

  const zone = useMemo<ZoneDTO | undefined>(
    () => zones.find((z) => z.sector === sector),
    [zones, sector],
  );
  const deliveryFee = zone?.delivery_fee ?? 0;
  const codAllowed = zone ? zone.cod_allowed : true;

  const addOnTotal = addOns.reduce(
    (s, id) => s + (ADD_ONS.find((a) => a.id === id)?.price ?? 0),
    0,
  );
  const perMeal = DAILY_PRICES[plan] * quantity + addOnTotal + extraRoti * EXTRA_ROTI_PRICE;
  const grandTotal = (perMeal + deliveryFee) * meals.length;

  // Force UPI if COD not allowed in this sector
  if (paymentMode === "cod" && !codAllowed) {
    setPaymentMode("upi");
  }

  function toggleAddOn(id: string) {
    setAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function stepError(s: number): string | null {
    switch (s) {
      case 1:
        if (deliveryDate < today) return "Please pick a valid delivery date.";
        return null;
      case 4:
        if (name.trim().length < 2) return "Please enter your full name.";
        if (!/^[6-9]\d{9}$/.test(mobile)) return "Enter a valid 10-digit mobile number.";
        if (!sameWhatsapp && whatsapp && !/^[6-9]\d{9}$/.test(whatsapp))
          return "Enter a valid WhatsApp number.";
        if (!sector) return "Please select your sector.";
        if (zone && quantity < zone.min_qty)
          return `Minimum ${zone.min_qty} tiffin(s) required for ${sector}.`;
        if (address.trim().length < 8) return "Please enter your full delivery address.";
        return null;
      case 6:
        if (!terms) return "Please confirm you understand the booking cutoff policy.";
        return null;
      default:
        return null;
    }
  }

  function next() {
    const err = stepError(step);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    const err = stepError(6);
    if (err) {
      toast.error(err);
      return;
    }
    setSubmitting(true);
    try {
      const out: OrderResultDTO[] = [];
      for (const m of meals) {
        const r = await createOrderFn({
          data: {
            customer_name: name.trim(),
            mobile: mobile.trim(),
            whatsapp_number: (sameWhatsapp ? mobile : whatsapp).trim(),
            email: email.trim(),
            meal: m,
            delivery_date: deliveryDate,
            plan_slug: plan,
            quantity,
            add_ons: addOns,
            spice_pref: spice,
            rice_pref: ricePref,
            extra_roti: extraRoti,
            address: address.trim(),
            landmark: landmark.trim(),
            sector,
            maps_link: mapsLink.trim(),
            payment_mode: paymentMode,
            upi_txn_id: upiTxn.trim(),
            special_note: note.trim(),
            late_request: isLate,
          },
        });
        out.push(r);
      }
      onSuccess(out);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not place your order.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-10 sm:px-6 lg:pb-12">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
            Place Your Order
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-foreground sm:text-5xl">
            Order Your Tiffin
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            A few guided steps — we'll confirm everything on WhatsApp. Fresh, ghar-jaisa khana on the
            way.
          </p>
        </div>

        {/* Progress */}
        <Progress step={step} onJump={(s) => s < step && setStep(s)} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Step body */}
          <div key={step} className="animate-fade-in space-y-6">
            {step === 0 && (
              <StepCard title="Choose your meal" subtitle="Lunch, dinner, or the full day.">
                <div className="grid gap-3 sm:grid-cols-3">
                  <MealOption
                    active={mealChoice === "lunch"}
                    onClick={() => setMealChoice("lunch")}
                    icon={Sun}
                    title="Lunch"
                    note="Midday thali"
                  />
                  <MealOption
                    active={mealChoice === "dinner"}
                    onClick={() => setMealChoice("dinner")}
                    icon={Moon}
                    title="Dinner"
                    note="Evening thali"
                  />
                  <MealOption
                    active={mealChoice === "both"}
                    onClick={() => setMealChoice("both")}
                    icon={Sparkles}
                    title="Lunch + Dinner"
                    note="Both meals"
                  />
                </div>

                <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-4 text-sm">
                  <p className="font-semibold text-foreground">Booking cutoff rules</p>
                  <ul className="mt-2 space-y-1.5 text-muted-foreground">
                    <li>
                      <span className="font-medium text-foreground">Tomorrow's lunch</span> — book
                      before midnight (12:00 AM) tonight.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Today's dinner</span> — book
                      before 12:00 PM (noon).
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Future meals</span> — up to 7
                      days in advance.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Late orders</span> — WhatsApp /
                      manual approval only.
                    </li>
                  </ul>
                </div>
              </StepCard>
            )}

            {step === 1 && (
              <StepCard title="Select delivery date" subtitle="We validate the cutoff live.">
                <div className="grid max-w-xs gap-1.5">
                  <Label htmlFor="date">Delivery date</Label>
                  <input
                    id="date"
                    type="date"
                    min={today}
                    max={maxDate}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="mt-4 space-y-3">
                  {cutoffs.map((c) => (
                    <CutoffBanner key={c.meal} meal={c.meal} allowed={c.allowed} reason={c.reason} date={deliveryDate} />
                  ))}
                </div>
                {isLate && (
                  <div className="mt-4 rounded-xl border border-terracotta/40 bg-terracotta/10 p-4 text-sm text-foreground">
                    <p className="font-semibold">Cutoff has passed for your selection.</p>
                    <p className="mt-1 text-muted-foreground">
                      You can still submit a <span className="font-medium text-foreground">late
                      order request</span> — our team will confirm availability on WhatsApp before
                      cooking. Or pick a later date above.
                    </p>
                  </div>
                )}
              </StepCard>
            )}

            {step === 2 && (
              <StepCard title="Select your plan" subtitle="Pick the spread that suits your appetite.">
                <div className="grid gap-3 sm:grid-cols-3">
                  {PLAN_CATALOG.map((p) => (
                    <button
                      type="button"
                      key={p.slug}
                      onClick={() => setPlan(p.slug)}
                      className={`relative rounded-2xl border p-4 text-left transition-all ${
                        plan === p.slug
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-mustard px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mustard-foreground">
                          <Star className="h-3 w-3" /> Popular
                        </span>
                      )}
                      <p className="font-serif text-lg font-bold capitalize text-foreground">
                        {p.name}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatINR(p.price)} <span className="text-xs font-normal text-muted-foreground">/ meal</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
                      <ul className="mt-3 space-y-1">
                        {p.items.map((it) => (
                          <li key={it} className="flex items-start gap-1.5 text-xs text-foreground">
                            <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {it}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                  Looking for trial, weekly or monthly subscriptions?{" "}
                  <Link to="/subscription" className="font-semibold text-primary underline">
                    Explore subscription plans
                  </Link>{" "}
                  ({SUBSCRIPTION_PLANS.map((s) => s.name).join(", ")}).
                </div>
              </StepCard>
            )}

            {step === 3 && (
              <StepCard title="Customize your meal" subtitle="Make it just the way you like.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="qty">Quantity (per meal)</Label>
                    <Input
                      id="qty"
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Math.min(20, Number(e.target.value))))
                      }
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="extra-roti">Extra roti ({formatINR(EXTRA_ROTI_PRICE)} each)</Label>
                    <Input
                      id="extra-roti"
                      type="number"
                      min={0}
                      max={10}
                      value={extraRoti}
                      onChange={(e) =>
                        setExtraRoti(Math.max(0, Math.min(10, Number(e.target.value))))
                      }
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Spice level</Label>
                    <Select value={spice} onValueChange={setSpice}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less">Less spicy</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="extra">Extra spicy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Rice preference</Label>
                    <Select value={ricePref ? "yes" : "no"} onValueChange={(v) => setRicePref(v === "yes")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Include rice</SelectItem>
                        <SelectItem value="no">No rice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-5">
                  <Label>Add-ons</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ADD_ONS.map((a) => (
                      <label
                        key={a.id}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-sm transition-colors ${
                          addOns.includes(a.id) ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <Checkbox
                          checked={addOns.includes(a.id)}
                          onCheckedChange={() => toggleAddOn(a.id)}
                        />
                        <span className="flex-1">{a.label}</span>
                        <span className="text-xs text-muted-foreground">+{a.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-1.5">
                  <Label htmlFor="note">Special note (optional)</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any instructions for the kitchen — e.g. no onion garlic, less oil"
                  />
                </div>
              </StepCard>
            )}

            {step === 4 && (
              <StepCard title="Delivery details" subtitle="Where should we bring your tiffin?">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Full name" id="name" value={name} onChange={setName} required />
                  <TextField
                    label="Mobile number"
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={setMobile}
                    placeholder="10-digit number"
                    required
                  />
                </div>
                <label className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox checked={sameWhatsapp} onCheckedChange={(v) => setSameWhatsapp(Boolean(v))} />
                  WhatsApp number is the same as mobile
                </label>
                {!sameWhatsapp && (
                  <div className="mt-3 grid max-w-sm gap-1.5">
                    <TextField
                      label="WhatsApp number"
                      id="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={setWhatsapp}
                      placeholder="10-digit WhatsApp number"
                    />
                  </div>
                )}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label>Sector / area</Label>
                    <Select value={sector} onValueChange={setSector}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map((z) => (
                          <SelectItem key={z.sector} value={z.sector}>
                            {z.sector}
                            {z.delivery_fee > 0 ? ` · +${formatINR(z.delivery_fee)} delivery` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <TextField label="Email (optional)" id="email" type="email" value={email} onChange={setEmail} />
                </div>

                {zone && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <Badge>
                      {zone.delivery_fee > 0 ? `${formatINR(zone.delivery_fee)} delivery` : "Free delivery"}
                    </Badge>
                    {zone.min_qty > 1 && <Badge>Min {zone.min_qty} tiffins</Badge>}
                    <Badge>{zone.cod_allowed ? "COD available" : "UPI only"}</Badge>
                  </div>
                )}

                <div className="mt-4 grid gap-1.5">
                  <Label htmlFor="address">Full address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / flat no., building, street..."
                    required
                  />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <TextField label="Landmark" id="landmark" value={landmark} onChange={setLandmark} />
                  <TextField
                    label="Google Maps location link"
                    id="maps"
                    value={mapsLink}
                    onChange={setMapsLink}
                    placeholder="Paste exact location link"
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  An exact Google Maps link helps our rider reach you faster.
                </p>
              </StepCard>
            )}

            {step === 5 && (
              <StepCard title="Payment" subtitle="Pay securely via UPI or choose COD.">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode("upi")}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                      paymentMode === "upi" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                    }`}
                  >
                    <Wallet className="mt-0.5 h-5 w-5 text-primary" />
                    <span>
                      <span className="block font-semibold text-foreground">UPI / QR</span>
                      <span className="text-xs text-muted-foreground">
                        Pay to <span className="font-medium text-foreground">{UPI_ID}</span>
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => codAllowed && setPaymentMode("cod")}
                    disabled={!codAllowed}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      paymentMode === "cod" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border"
                    }`}
                  >
                    <Truck className="mt-0.5 h-5 w-5 text-terracotta" />
                    <span>
                      <span className="block font-semibold text-foreground">Cash on Delivery</span>
                      <span className="text-xs text-muted-foreground">
                        {codAllowed ? "Pay when it arrives" : "Not available for this sector"}
                      </span>
                    </span>
                  </button>
                </div>

                {paymentMode === "upi" && (
                  <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4">
                    <p className="text-sm text-foreground">
                      Pay <span className="font-bold text-primary">{formatINR(grandTotal)}</span> to{" "}
                      <span className="font-semibold">{UPI_ID}</span>, then enter your UPI reference
                      below. You can also share the screenshot on WhatsApp after placing the order.
                    </p>
                    <div className="mt-3 grid max-w-sm gap-1.5">
                      <Label htmlFor="txn">UPI transaction ID (optional now)</Label>
                      <Input
                        id="txn"
                        value={upiTxn}
                        onChange={(e) => setUpiTxn(e.target.value)}
                        placeholder="e.g. 4071XXXXXX"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-start gap-2 rounded-lg bg-mustard/10 p-3 text-xs text-foreground">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Payment status stays <span className="font-semibold">Pending</span> until our team
                  verifies it. You'll get a WhatsApp confirmation either way.
                </div>
              </StepCard>
            )}

            {step === 6 && (
              <StepCard title="Review & confirm" subtitle="One last look before we start cooking.">
                <dl className="divide-y divide-border text-sm">
                  <ReviewRow label="Meal" value={mealChoice === "both" ? "Lunch + Dinner" : mealChoice} capitalize />
                  <ReviewRow label="Date" value={deliveryDate} />
                  <ReviewRow label="Plan" value={`${plan} × ${quantity}`} capitalize />
                  {addOns.length > 0 && (
                    <ReviewRow label="Add-ons" value={addOns.map((id) => ADD_ONS.find((a) => a.id === id)?.label).join(", ")} />
                  )}
                  <ReviewRow label="Spice" value={spice} capitalize />
                  <ReviewRow label="Delivery to" value={`${sector} — ${name}`} />
                  <ReviewRow label="Mobile" value={mobile} />
                  <ReviewRow label="Payment" value={paymentMode === "upi" ? "UPI / QR" : "Cash on Delivery"} />
                  <ReviewRow label="Total" value={formatINR(grandTotal)} bold />
                </dl>

                <label className="mt-4 flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
                  <Checkbox checked={terms} onCheckedChange={(v) => setTerms(Boolean(v))} />
                  <span className="text-muted-foreground">
                    I understand the lunch and dinner booking cutoff policy and accept the{" "}
                    <Link to="/terms" className="underline">terms</Link> &{" "}
                    <Link to="/cancellation-policy" className="underline">cancellation policy</Link>.
                  </span>
                </label>

                {isLate && (
                  <div className="mt-3 rounded-lg bg-terracotta/10 p-3 text-xs text-foreground">
                    This is a <span className="font-semibold">late order request</span>. It won't be
                    auto-confirmed — our team will reach out on WhatsApp.
                  </div>
                )}
              </StepCard>
            )}

            {/* Desktop nav buttons */}
            <div className="hidden items-center justify-between lg:flex">
              <Button variant="outline" onClick={back} disabled={step === 0}>
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button variant="default" onClick={next}>
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <PlaceOrderButton
                  isLate={isLate}
                  submitting={submitting}
                  onSubmit={submit}
                  waLink={buildWhatsAppLink(
                    `Hi! I'd like to request a late ${mealChoice} order for ${deliveryDate}.`,
                  )}
                />
              )}
            </div>
          </div>

          {/* Summary sidebar (desktop) */}
          <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <SummaryCard
              meals={meals}
              plan={plan}
              quantity={quantity}
              perMeal={perMeal}
              addOnTotal={addOnTotal}
              extraRoti={extraRoti}
              deliveryFee={deliveryFee}
              grandTotal={grandTotal}
              paymentMode={paymentMode}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total</p>
            <p className="font-serif text-lg font-bold text-primary">{formatINR(grandTotal)}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={back}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button variant="mustard" onClick={next}>
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <PlaceOrderButton
                isLate={isLate}
                submitting={submitting}
                onSubmit={submit}
                compact
                waLink={buildWhatsAppLink(
                  `Hi! I'd like to request a late ${mealChoice} order for ${deliveryDate}.`,
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceOrderButton({
  isLate,
  submitting,
  onSubmit,
  waLink,
  compact,
}: {
  isLate: boolean;
  submitting: boolean;
  onSubmit: () => void;
  waLink: string;
  compact?: boolean;
}) {
  if (isLate) {
    return (
      <div className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}>
        <Button variant="mustard" onClick={onSubmit} disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
          {compact ? "Late request" : "Submit late request"}
        </Button>
        {!compact && (
          <Button asChild variant="outline">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> Request on WhatsApp
            </a>
          </Button>
        )}
      </div>
    );
  }
  return (
    <Button variant="mustard" size={compact ? "default" : "lg"} onClick={onSubmit} disabled={submitting}>
      {submitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Placing...
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> Place order
        </>
      )}
    </Button>
  );
}

function Progress({ step, onJump }: { step: number; onJump: (s: number) => void }) {
  return (
    <div className="mt-8 overflow-x-auto">
      <ol className="mx-auto flex min-w-max items-center justify-center gap-1.5">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={s.id} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onJump(i)}
                className={`flex items-center gap-2 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/50 text-muted-foreground"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    active ? "bg-primary-foreground/20" : done ? "bg-primary/20" : "bg-background"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-3 bg-border" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CutoffBanner({
  meal,
  allowed,
  reason,
  date,
}: {
  meal: "lunch" | "dinner";
  allowed: boolean;
  reason?: string;
  date: string;
}) {
  const countdownMs = getCutoffMoment(meal, date).getTime() - Date.now();
  return (
    <div
      className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
        allowed ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
      }`}
    >
      {allowed ? <Clock className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
      <span className="capitalize">
        <span className="font-semibold">{meal}</span>{" "}
        {allowed ? (
          <span className="font-normal">
            — booking open, closes in{" "}
            <span className="font-mono font-semibold">{formatCountdown(countdownMs)}</span>.
          </span>
        ) : (
          <span className="font-normal normal-case">— {reason}</span>
        )}
      </span>
    </div>
  );
}

function SummaryCard({
  meals,
  plan,
  quantity,
  perMeal,
  addOnTotal,
  extraRoti,
  deliveryFee,
  grandTotal,
  paymentMode,
}: {
  meals: ("lunch" | "dinner")[];
  plan: PlanSlug;
  quantity: number;
  perMeal: number;
  addOnTotal: number;
  extraRoti: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMode: "upi" | "cod";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-serif text-xl font-bold text-foreground">Order summary</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <SumRow label="Meals" value={meals.map((m) => m).join(" + ")} capitalize />
        <SumRow label="Plan" value={`${plan} × ${quantity}`} capitalize />
        <SumRow label="Base (per meal)" value={formatINR(DAILY_PRICES[plan] * quantity)} />
        {extraRoti > 0 && <SumRow label={`Extra roti × ${extraRoti}`} value={formatINR(extraRoti * EXTRA_ROTI_PRICE)} />}
        {addOnTotal > 0 && <SumRow label="Add-ons (per meal)" value={formatINR(addOnTotal)} />}
        {deliveryFee > 0 && <SumRow label="Delivery (per meal)" value={formatINR(deliveryFee)} />}
        {meals.length > 1 && <SumRow label="Meals count" value={`× ${meals.length}`} />}
        <div className="border-t border-border pt-2">
          <SumRow label="Total" value={formatINR(grandTotal)} bold />
        </div>
      </dl>
      <div className="mt-3 rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground">
        Payment: <span className="font-semibold text-foreground">{paymentMode === "upi" ? "UPI / QR" : "Cash on Delivery"}</span>. We confirm every order on WhatsApp.
      </div>
    </div>
  );
}

function StepCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="font-serif text-2xl font-bold text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function MealOption({
  active,
  onClick,
  icon: Icon,
  title,
  note,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Sun;
  title: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all ${
        active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40"
      }`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-full ${
          active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="font-serif text-base font-bold text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{note}</span>
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
      {children}
    </span>
  );
}

function TextField({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SumRow({ label, value, bold, capitalize }: { label: string; value: string; bold?: boolean; capitalize?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`${bold ? "font-serif text-lg font-bold text-primary" : "font-medium text-foreground"} ${capitalize ? "capitalize" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function ReviewRow({ label, value, bold, capitalize }: { label: string; value?: string; bold?: boolean; capitalize?: boolean }) {
  return (
    <div className="flex justify-between gap-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right ${bold ? "font-serif text-lg font-bold text-primary" : "font-medium text-foreground"} ${capitalize ? "capitalize" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

const NEXT_STEPS = [
  { icon: Check, label: "Order received" },
  { icon: ShieldCheck, label: "Admin confirmation" },
  { icon: ChefHat, label: "Cooking" },
  { icon: Truck, label: "Out for delivery" },
  { icon: PackageCheck, label: "Delivered" },
];

function Confirmation({ results, onReset }: { results: OrderResultDTO[]; onReset: () => void }) {
  const primary = results[0];
  const total = results.reduce((s, r) => s + r.total, 0);
  const isLate = results.some((r) => r.is_late_request);
  const codes = results.map((r) => r.order_code).join(", ");

  const message = `Hi Maa Jaisa Tiffin! Here's my order:
Order: ${codes}
Name: ${primary.customer_name}
${results.map((r) => `${r.meal} on ${r.delivery_date} — ${r.plan_name} × ${r.quantity}`).join("\n")}
Amount: ${formatINR(total)}
Payment: ${primary.payment_mode.toUpperCase()} (${primary.payment_status})
${isLate ? "This is a LATE ORDER REQUEST — please confirm availability." : "Please confirm."} Thank you!`;

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isLate ? "bg-mustard text-mustard-foreground" : "bg-primary text-primary-foreground"}`}>
          {isLate ? <Clock className="h-8 w-8" /> : <PartyPopper className="h-8 w-8" />}
        </div>
        <h1 className="mt-5 font-serif text-3xl font-bold text-foreground">
          {isLate ? "Late Order Requested!" : "Order Received!"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {isLate
            ? "We've logged your request. Our team will confirm availability on WhatsApp."
            : "Your order is placed. Tap below to send us a WhatsApp confirmation."}
        </p>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
          <p className="font-mono text-lg font-bold text-primary">{codes}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <ReviewRow label="Name" value={primary.customer_name} />
            {results.map((r) => (
              <ReviewRow key={r.order_code} label={r.meal} value={`${r.delivery_date} · ${r.plan_name} × ${r.quantity}`} capitalize />
            ))}
            <ReviewRow label="Payment" value={`${primary.payment_mode.toUpperCase()} (${primary.payment_status})`} />
            <div className="border-t border-border pt-2">
              <ReviewRow label="Total" value={formatINR(total)} bold />
            </div>
          </dl>
          {primary.payment_mode === "upi" && (
            <p className="mt-3 rounded-md bg-mustard/15 p-2.5 text-xs text-foreground">
              Pay {formatINR(total)} to UPI ID <span className="font-semibold">{UPI_ID}</span> and
              share the screenshot on WhatsApp.
            </p>
          )}
        </div>

        {/* Next steps */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left shadow-sm">
          <p className="text-sm font-semibold text-foreground">What happens next</p>
          <ol className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.label} className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-secondary/50 px-2.5 py-1 font-medium text-foreground">
                  <s.icon className="h-3.5 w-3.5 text-primary" /> {s.label}
                </span>
                {i < NEXT_STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="mustard" size="xl">
            <a href={buildWhatsAppLink(message)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Confirm on WhatsApp
            </a>
          </Button>
          <Button variant="outline" size="xl" onClick={onReset}>
            <Check className="h-5 w-5" /> Place Another Order
          </Button>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> Delivering fresh across Noida sectors
        </p>
      </div>
    </div>
  );
}
