import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "Terms and conditions for ordering home-style tiffin from Maa Jaisa Tiffin in Noida, including booking, delivery and quality terms.",
      },
    ],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Legal"
      title="Terms & Conditions"
      subtitle="By placing an order with Maa Jaisa Tiffin you agree to the following terms."
      sections={[
        {
          heading: "Booking",
          items: [
            "Tomorrow's lunch must be booked before 12:00 AM the night before.",
            "Today's dinner must be booked before 12:00 PM the same day.",
            "Future orders can be booked up to 7 days in advance.",
            "Late orders are accepted only based on availability and may carry an extra charge.",
          ],
        },
        {
          heading: "Delivery",
          items: [
            "Delivery times are approximate and may vary due to traffic or weather.",
            "An exact Google Maps location link is required for smooth delivery.",
            "If the customer is unavailable, a re-delivery charge may apply.",
          ],
        },
        {
          heading: "Quality",
          items: [
            "Food is freshly cooked daily with no palm oil and no stale food.",
            "Maximum raw material is sourced from our own farm or trusted farmers.",
            "Menu may change slightly based on fresh seasonal availability.",
          ],
        },
        {
          heading: "Payment",
          items: [
            "Daily orders are preferably prepaid via UPI.",
            "Monthly plans require advance payment.",
            "Cash on Delivery is available in selected areas only.",
          ],
        },
      ]}
    />
  ),
});
