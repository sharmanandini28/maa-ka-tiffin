export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  category: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    category: "Ordering",
    items: [
      {
        q: "How do I place an order?",
        a: "Go to the Order page, choose your plan, pick a date and meal, add your address and pay via UPI/QR or COD. You'll then get a WhatsApp confirmation.",
      },
      {
        q: "Can I order just one meal to try?",
        a: "Yes. We offer trial packs (1, 3 or 7 days) so you can test taste, hygiene, timing and quantity before subscribing.",
      },
      {
        q: "Can I customise my meal?",
        a: "We allow light customisation — spice level, rice yes/no, extra roti/rice and add-ons. Fully custom menus aren't available to keep the kitchen fast and consistent.",
      },
    ],
  },
  {
    category: "Cut-off Rules",
    items: [
      {
        q: "When is the cut-off for tomorrow's lunch?",
        a: "Tomorrow's lunch must be booked before 12:00 AM (midnight) the night before.",
      },
      {
        q: "When is the cut-off for today's dinner?",
        a: "Today's dinner must be booked before 12:00 PM (noon) the same day.",
      },
      {
        q: "How far in advance can I book?",
        a: "You can pre-book future meals 2–7 days in advance, perfect for planning your week.",
      },
      {
        q: "What if I miss the cut-off?",
        a: "After cut-off, orders are taken only via WhatsApp and depend on availability. A small extra charge may apply for late orders.",
      },
    ],
  },
  {
    category: "Plans & Pricing",
    items: [
      {
        q: "What's the difference between Basic, Standard and Premium?",
        a: "They vary by portion size and inclusions — extra roti/sabzi, curd, sweets, papad/pickle and premium packaging. Compare them in detail on the Plans page.",
      },
      {
        q: "How do meal credits work?",
        a: "Monthly plans give you a fixed number of meal credits (e.g. 26 lunches). Each delivered meal uses one credit; paused days don't.",
      },
    ],
  },
  {
    category: "Pause & Cancellation",
    items: [
      {
        q: "Can I pause my subscription?",
        a: "Yes. Pause tomorrow's lunch before midnight, or today's dinner before noon. Monthly plans allow up to 4 pauses per month.",
      },
      {
        q: "Can I cancel and get a refund?",
        a: "Unused meal credits can be refunded or carried forward as per our cancellation policy. Already-cooked meals can't be refunded.",
      },
    ],
  },
  {
    category: "Delivery",
    items: [
      {
        q: "Which areas do you deliver to?",
        a: "We serve selected Noida sectors — 58, 59, 62, 63, 65, 76, 78, 137, 142 and nearby PG/office areas. Coverage keeps expanding.",
      },
      {
        q: "What are the delivery timings?",
        a: "Lunch is delivered 12:00–2:00 PM and dinner 7:00–9:00 PM. Exact timing may vary slightly with traffic and weather.",
      },
    ],
  },
  {
    category: "Payment",
    items: [
      {
        q: "How do I pay?",
        a: "Pay via UPI/QR for daily orders, or choose Cash on Delivery in selected areas. Monthly plans prefer advance payment.",
      },
      {
        q: "Is online payment safe?",
        a: "Yes. UPI payments go directly to our verified business UPI ID, and our team marks your payment as verified before delivery.",
      },
    ],
  },
  {
    category: "Purity & Hygiene",
    items: [
      {
        q: "Is the food pure vegetarian?",
        a: "Yes — 100% pure vegetarian, home-style, with no palm oil, no heavy masala and no adulterated cheap ingredients.",
      },
      {
        q: "Where do your ingredients come from?",
        a: "Maximum raw material comes from our own farm and trusted local farmers, selected for purity rather than the lowest price.",
      },
    ],
  },
];
