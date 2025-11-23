import WorkshopsHeroSection from "@/components/sections/workshops/workshops-hero-section";
import WorkshopsListSection from "@/components/sections/workshops/workshops-list-section";
import FooterSection from "@/components/sections/footer/footer-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workshops y Talleres | IA Hackathon Peru 2025",
  description:
    "Participa en 8 workshops gratuitos del 18 al 28 de noviembre sobre IA, Figma, Lovable, Serverless, Clerk, MCP y más. Aprende de expertos antes del IA Hackathon Peru 2025.",
  keywords: [
    "workshops",
    "talleres",
    "IA",
    "inteligencia artificial",
    "hackathon",
    "Peru",
    "Lovable",
    "Clerk",
    "Serverless",
    "Vercel",
    "desarrollo",
  ],
  openGraph: {
    title: "Workshops y Talleres | IA Hackathon Peru 2025",
    description:
      "Participa en 8 workshops gratuitos del 18 al 28 de noviembre sobre IA, Figma, Lovable, Serverless, Clerk y más. Eventos online preparatorios para el hackathon.",
    url: "https://peru.ai-hackathon.co/workshops",
    siteName: "IA Hackathon Peru",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IA Hackathon Peru 2025 - Workshops",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workshops y Talleres | IA Hackathon Peru 2025",
    description:
      "8 workshops gratuitos del 19-28 Nov: IA, Figma, Lovable, Serverless, Clerk, MCP. Online y gratuito.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://peru.ai-hackathon.co/workshops",
  },
};

export default function WorkshopsPage() {
  const workshopEvents = [
    {
      name: "De la idea al prototipo funcional: IA, Figma y Vibe Coding en acción",
      startDate: "2025-11-18T19:00:00-05:00",
      url: "https://luma.com/embed/event/evt-JH2aVEI18JkBa6O",
    },
    {
      name: "De Cero a Producción: Construye Apps Móviles más Rápido con IA, Expo y Supabase",
      startDate: "2025-11-21T19:00:00-05:00",
      url: "https://luma.com/embed/event/evt-fRK0BHtluFjMmGJ/simple",
    },
    {
      name: "Cómo implementar un chatbot de atención al cliente en tu empresa, sin servidores, en AWS",
      startDate: "2025-11-23T19:00:00-05:00",
      url: "https://luma.com/afar70gw",
    },
    {
      name: "Lovable",
      startDate: "2025-11-24T10:00:00-05:00",
      url: "https://luma.com/embed/event/evt-bKIYraV1WFuAtat",
    },
    {
      name: "Serverless para el despliegue de tus prototipos",
      startDate: "2025-11-24T19:00:00-05:00",
      url: "https://luma.com/embed/event/evt-4P2LUnbPJgMgJBc",
    },
    {
      name: "Métele más diseño: Herramientas para vibecodear sin sacrificar diseño",
      startDate: "2025-11-25T18:00:00-05:00",
      url: "https://luma.com/embed/event/evt-rgjgXaPshpMCQQc",
    },
    {
      name: "Add auth to your app in seconds with Clerk",
      startDate: "2025-11-25T19:00:00-05:00",
      url: "https://luma.com/embed/event/evt-D2X1QLuzb8zz3LG",
    },
    {
      name: "De la idea al impacto: cómo construir productos de IA que la gente realmente use",
      startDate: "2025-11-26T19:00:00-05:00",
      url: "https://luma.com/embed/event/evt-GLmGu1OMFy4C88k",
    },
    {
      name: "Build MCP's in minutes with Vercel AI SDK and Lupa",
      startDate: "2025-11-27T19:00:00-05:00",
      url: "https://luma.com/embed/event/evt-RNCH2399KcMOt4r",
    },
    {
      name: "De idea a Demo",
      startDate: "2025-11-27T19:00:00-05:00",
      url: "https://luma.com/5vt6xzqu",
    },
    {
      name: "Creando un unicornio",
      startDate: "2025-11-28T18:00:00-05:00",
      url: "https://luma.com/embed/event/evt-aw4mxgcSkgAcUNp/simple",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "IA Hackathon Peru 2025 - Workshops",
    description:
      "Serie de workshops preparatorios para el IA Hackathon Peru 2025",
    itemListElement: workshopEvents.map((workshop, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: workshop.name,
        startDate: workshop.startDate,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "VirtualLocation",
          url: workshop.url,
        },
        organizer: {
          "@type": "Organization",
          name: "IA Hackathon Peru",
          url: "https://peru.ai-hackathon.co",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: workshop.url,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <WorkshopsHeroSection />
      <WorkshopsListSection />
      <FooterSection />
    </>
  );
}
