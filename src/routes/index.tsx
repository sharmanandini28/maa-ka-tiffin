import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { PurityStrip } from "@/components/home/PurityStrip";
import { StatsBand } from "@/components/home/StatsBand";
import { MenuPreview } from "@/components/home/MenuPreview";
import { PlansSection } from "@/components/home/PlansSection";
import { KhetBand } from "@/components/home/KhetBand";
import { WhyChoose } from "@/components/home/WhyChoose";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BookingTimeline } from "@/components/home/BookingTimeline";
import { DeliveryPreview } from "@/components/home/DeliveryPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqPreview } from "@/components/home/FaqPreview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { plansQueryOptions, weekMenuQueryOptions } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maa Jaisa Tiffin — Ghar Jaisa Shuddh Tiffin Service in Noida" },
      {
        name: "description",
        content:
          "Premium home-style pure veg tiffin service in Noida. Farm-fresh, trusted-source ingredients, no palm oil, no milawat. Daily fresh lunch & dinner with monthly subscription plans.",
      },
      {
        name: "keywords",
        content:
          "tiffin service Noida, ghar jaisa khana Noida, home food delivery Noida, monthly tiffin service Noida, pure veg tiffin Noida, office lunch tiffin Noida, homemade food Noida",
      },
      { property: "og:title", content: "Maa Jaisa Tiffin — Ghar Jaisa Shuddh Tiffin in Noida" },
      {
        property: "og:description",
        content:
          "Home-style pure veg tiffin service in Noida with farm-fresh ingredients and daily fresh cooking.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FoodEstablishment",
          name: "Maa Jaisa Tiffin",
          servesCuisine: "Indian home-style vegetarian",
          description:
            "Pre-order home-style pure vegetarian tiffin service in Noida with farm-fresh ingredients, no palm oil and daily fresh cooking.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
          telephone: "+91-93112-34567",
          priceRange: "₹₹",
        }),
      },
    ],
  }),
  loader: ({ context }) => {
    void context.queryClient.ensureQueryData(plansQueryOptions);
    void context.queryClient.ensureQueryData(weekMenuQueryOptions);
  },
  component: Index,
});

function SectionFallback() {
  return <div className="min-h-[280px] animate-pulse bg-secondary/20" />;
}

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <PurityStrip />
      <StatsBand />
      <Suspense fallback={<SectionFallback />}>
        <MenuPreview />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <PlansSection />
      </Suspense>
      <KhetBand />
      <WhyChoose />
      <HowItWorks />
      <BookingTimeline />
      <DeliveryPreview />
      <Testimonials />
      <FaqPreview />
      <FinalCTA />
    </SiteLayout>
  );
}
