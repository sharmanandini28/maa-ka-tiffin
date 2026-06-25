export const WHATSAPP_NUMBER = "919311234567"; // Maa Jaisa Tiffin support line
export const SUPPORT_PHONE_DISPLAY = "+91 93112 34567";
export const SUPPORT_EMAIL = "hello@maajaisatiffin.in";
export const BRAND_NAME = "Maa Jaisa Tiffin";
export const PAYMENT_UPI_ID = "your-upi-id@bank";
export const PAYMENT_PAYEE_NAME = BRAND_NAME;
export const PAYMENT_INSTRUCTION_TEXT =
  "UPI payment ke baad order automatic confirm nahi hota. Screenshot/transaction ID verify hone ke baad admin order confirm karega.";
export const PAYMENT_SCREENSHOT_INSTRUCTION =
  "Payment complete karne ke baad screenshot WhatsApp par bhejein. Admin verify hone ke baad order confirm hoga.";
export const PAYMENT_TRANSACTION_ID_REQUIRED = false;

// Backward-compatible alias for existing UI copy.
export const UPI_ID = PAYMENT_UPI_ID;

export const NOIDA_SECTORS = [
  "Sector 58",
  "Sector 59",
  "Sector 62",
  "Sector 63",
  "Sector 65",
  "Sector 76",
  "Sector 78",
  "Sector 137",
  "Sector 142",
  "Other (nearby)",
];

export const DAILY_PRICES: Record<string, number> = {
  basic: 79,
  standard: 109,
  premium: 139,
};
export const EXTRA_ROTI_PRICE = 15;

export const ADD_ONS: { id: string; label: string; price: number }[] = [
  { id: "extra-roti", label: "Extra Roti", price: 15 },
  { id: "extra-rice", label: "Extra Rice", price: 25 },
  { id: "extra-dal", label: "Extra Dal", price: 30 },
  { id: "curd", label: "Curd", price: 20 },
  { id: "sweet", label: "Sweet", price: 30 },
  { id: "papad", label: "Papad", price: 10 },
  { id: "salad", label: "Extra Salad", price: 15 },
  { id: "pickle", label: "Pickle", price: 10 },
];

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPaymentAmount(amount: number): string {
  return amount.toFixed(2);
}

export function buildUpiPaymentUri({ amount, note }: { amount: number; note?: string }): string {
  const params = new URLSearchParams({
    pa: PAYMENT_UPI_ID,
    pn: PAYMENT_PAYEE_NAME,
    am: formatPaymentAmount(amount),
    cu: "INR",
    tn: note?.trim() || `${BRAND_NAME} Order`,
  });

  return `upi://pay?${params.toString()}`;
}

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Build a WhatsApp deep link to a specific customer number (India).
export function buildWhatsAppTo(number: string, message: string): string {
  const digits = (number || "").replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${digits}?text=${encodeURIComponent(message)}`;
}

// ---- Booking rules (single source of truth, shown everywhere) ----
export const BOOKING_RULES = [
  {
    key: "lunch",
    title: "Tomorrow's Lunch",
    cutoff: "Before 12:00 AM (midnight)",
    note: "Book tomorrow's lunch before midnight tonight.",
  },
  {
    key: "dinner",
    title: "Today's Dinner",
    cutoff: "Before 12:00 PM (noon)",
    note: "Book today's dinner before noon the same day.",
  },
  {
    key: "future",
    title: "Future Meals",
    cutoff: "2–7 days in advance",
    note: "Plan ahead and pre-book meals up to a week out.",
  },
  {
    key: "late",
    title: "Late Orders",
    cutoff: "WhatsApp / manual approval",
    note: "After cut-off, order via WhatsApp — subject to availability.",
  },
] as const;

// ---- Purity promises ----
export const PURITY_PROMISES = [
  { title: "No Palm Oil", body: "Only clean, trusted cooking oils — never palm or reused oil." },
  { title: "No Milawat", body: "No adulterated, cheap local raw material. Pure ingredients only." },
  { title: "No Heavy Masala", body: "Light, home-style cooking that's easy on the stomach." },
  { title: "Farm Sourced", body: "Maximum raw material from our own farm & trusted farmers." },
  { title: "Fresh Daily", body: "Cooked fresh every day on a pre-order basis — never stale." },
];

// ---- Why choose us ----
export const WHY_CHOOSE = [
  {
    title: "Real Ghar Ka Taste",
    body: "Simple, balanced meals that taste like home — not a restaurant.",
  },
  { title: "Trust & Purity", body: "Farm-fresh sourcing, no palm oil, no milawat, no shortcuts." },
  {
    title: "Spotless Hygiene",
    body: "Clean kitchen, food-grade packaging and a daily hygiene checklist.",
  },
  { title: "Daily Convenience", body: "Pre-order lunch & dinner — delivered hot, right on time." },
  {
    title: "Flexible Subscriptions",
    body: "Trial, weekly and monthly plans with easy pause options.",
  },
  {
    title: "Less Wastage",
    body: "Cutoff-based cooking means fresher food and a smaller footprint.",
  },
];

// ---- How it works ----
export const HOW_IT_WORKS = [
  { step: "01", title: "Choose Your Meal", body: "Pick your plan and lunch, dinner, or both." },
  { step: "02", title: "Pick Your Date", body: "Select a date — we validate the cut-off live." },
  { step: "03", title: "Confirm & Pay", body: "Pay via UPI/QR or COD, then confirm on WhatsApp." },
  {
    step: "04",
    title: "Receive Fresh Food",
    body: "Hot, home-style tiffin delivered to your door.",
  },
];

// ---- Stats ----
export const STATS = [
  { value: 1200, suffix: "+", label: "Tiffins delivered" },
  { value: 9, suffix: "", label: "Noida sectors served" },
  { value: 100, suffix: "%", label: "Pure vegetarian" },
  { value: 0, suffix: "", label: "Palm oil, ever" },
];

// ---- Delivery zones ----
export const DELIVERY_ZONES = [
  { sector: "Sector 58", area: "Offices & corporates", live: true },
  { sector: "Sector 59", area: "Metro & PG belt", live: true },
  { sector: "Sector 62", area: "IT parks & PGs", live: true },
  { sector: "Sector 63", area: "Industrial & offices", live: true },
  { sector: "Sector 65", area: "Residential & PGs", live: true },
  { sector: "Sector 76", area: "High-rise societies", live: true },
  { sector: "Sector 78", area: "High-rise societies", live: true },
  { sector: "Sector 137", area: "Expressway corridor", live: true },
  { sector: "Sector 142", area: "Expressway corridor", live: true },
  { sector: "Sector 18", area: "Coming soon", live: false },
  { sector: "Sector 50", area: "Coming soon", live: false },
  { sector: "Greater Noida W.", area: "Coming soon", live: false },
];

// ---- Testimonials ----
export const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    role: "Working professional, Sector 62",
    quote:
      "Bilkul ghar jaisa khana. The dal and sabzi taste exactly like my mom makes it. Light, fresh and never oily.",
    rating: 5,
  },
  {
    name: "Rohit Verma",
    role: "PG resident, Sector 65",
    quote:
      "As someone living away from home, this is a blessing. Monthly plan se daily tension khatam. Hygiene is top-notch.",
    rating: 5,
  },
  {
    name: "Priya & Karan",
    role: "Working couple, Sector 76",
    quote:
      "We both have busy jobs. Lunch + dinner subscription saves us hours every day, and the food is genuinely healthy.",
    rating: 5,
  },
  {
    name: "Meera Nair",
    role: "Office manager, Sector 63",
    quote:
      "We order bulk lunches for our team. Always on time, always fresh. The no-palm-oil promise really matters to us.",
    rating: 5,
  },
];

// ---- Plan feature comparison ----
export const PLAN_FEATURES: {
  feature: string;
  basic: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
}[] = [
  { feature: "Roti (fresh phulka)", basic: "4", standard: "5", premium: "6" },
  { feature: "Sabzi", basic: "1", standard: "2", premium: "2" },
  { feature: "Dal", basic: true, standard: true, premium: true },
  { feature: "Rice", basic: true, standard: true, premium: true },
  { feature: "Salad", basic: true, standard: true, premium: true },
  { feature: "Curd / Raita", basic: false, standard: true, premium: true },
  { feature: "Sweet (twice a week)", basic: false, standard: false, premium: true },
  { feature: "Papad / Pickle", basic: false, standard: true, premium: true },
  { feature: "Premium packaging", basic: false, standard: true, premium: true },
];

// ---- Daily plan catalog (used by the order wizard) ----
export type PlanSlug = "basic" | "standard" | "premium";

export const PLAN_CATALOG: {
  slug: PlanSlug;
  name: string;
  price: number;
  tagline: string;
  items: string[];
  popular?: boolean;
}[] = [
  {
    slug: "basic",
    name: "Basic",
    price: DAILY_PRICES.basic,
    tagline: "Light & simple everyday meal",
    items: ["4 Roti (phulka)", "1 Sabzi", "Dal", "Rice", "Salad"],
  },
  {
    slug: "standard",
    name: "Standard",
    price: DAILY_PRICES.standard,
    tagline: "Our most-loved balanced thali",
    items: ["5 Roti (phulka)", "2 Sabzi", "Dal", "Rice", "Salad", "Curd / Raita", "Papad"],
    popular: true,
  },
  {
    slug: "premium",
    name: "Premium",
    price: DAILY_PRICES.premium,
    tagline: "Fullest spread with a sweet treat",
    items: [
      "6 Roti (phulka)",
      "2 Sabzi",
      "Dal",
      "Rice",
      "Salad",
      "Curd / Raita",
      "Sweet (2x/week)",
      "Premium packaging",
    ],
  },
];

// ---- Subscription plans (link out to /subscription, not the daily order flow) ----
export const SUBSCRIPTION_PLANS = [
  { slug: "trial", name: "Trial Pack", period: "3 meals", note: "Taste before you commit." },
  { slug: "weekly", name: "Weekly Plan", period: "6 days", note: "One week of fresh tiffins." },
  { slug: "monthly", name: "Monthly Plan", period: "28 days", note: "Best value, fewer worries." },
];

// ---- Kitchen buffer presets ----
export const BUFFER_OPTIONS = [0, 5, 10] as const;
