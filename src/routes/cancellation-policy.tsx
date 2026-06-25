import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/cancellation-policy")({
  head: () => ({
    meta: [
      { title: "Cancellation Policy — Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "Cancellation and pause policy for Maa Jaisa Tiffin. Lunch before midnight, dinner before noon. After cut-off, refunds are not guaranteed.",
      },
    ],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Policy"
      title="Cancellation & Pause Policy"
      subtitle="Our cut-off based system keeps food fresh and reduces wastage. Here's how cancellations work."
      sections={[
        {
          heading: "Daily Orders",
          items: [
            "Lunch cancellation or pause is allowed before 12:00 AM (midnight) the night before.",
            "Dinner cancellation or pause is allowed before 12:00 PM (noon) the same day.",
            "After the cut-off, cancellation and refund are not guaranteed as the food is already being prepared.",
          ],
        },
        {
          heading: "Monthly Plans",
          items: [
            "Up to 4 pauses per month are allowed within the cut-off times.",
            "Extra pauses may be chargeable or require manual approval.",
            "A paused meal does not deduct from your meal credits when paused within the allowed time.",
          ],
        },
        {
          heading: "Refunds",
          items: [
            "Prepaid daily orders cancelled before cut-off are eligible for a refund or credit.",
            "After cut-off, refunds are at our discretion based on whether the meal was already cooked.",
          ],
        },
      ]}
    />
  ),
});
