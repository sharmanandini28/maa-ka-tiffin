import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Maa Jaisa Tiffin Noida" },
      {
        name: "description",
        content:
          "Privacy policy for Maa Jaisa Tiffin. How we collect and use your contact and delivery details to fulfil your tiffin orders.",
      },
    ],
  }),
  component: () => (
    <PolicyPage
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="We respect your privacy and only use your details to deliver your meals."
      sections={[
        {
          heading: "What We Collect",
          items: [
            "Your name, mobile number and optional email.",
            "Your delivery address, landmark, sector and Google Maps location link.",
            "Your order details and preferences.",
          ],
        },
        {
          heading: "How We Use It",
          items: [
            "To prepare, confirm and deliver your tiffin orders.",
            "To contact you on WhatsApp or phone about your order and delivery.",
            "To improve our menu, service and delivery planning.",
          ],
        },
        {
          heading: "What We Don't Do",
          items: [
            "We do not sell your personal information to third parties.",
            "We do not send unrelated marketing without your consent.",
          ],
        },
        {
          heading: "Contact",
          items: ["For any privacy questions, reach us on WhatsApp at +91 93112 34567."],
        },
      ]}
    />
  ),
});
