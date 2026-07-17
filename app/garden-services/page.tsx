import Image from "next/image";
import QuoteForm from "@/components/services/QuoteForm";
import { Home, Building2, Sprout } from "lucide-react";

const SERVICES = [
  {
    icon: Home,
    title: "Residential Landscape",
    desc: "Transform your home garden or backyard into a lush, low-maintenance green space designed around your lifestyle.",
    image: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600",
  },
  {
    icon: Building2,
    title: "Commercial Landscape",
    desc: "Elevate office parks, plazas, and commercial properties with landscaping that impresses clients and employees alike.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600",
  },
  {
    icon: Sprout,
    title: "Indoor Plant-Scaping",
    desc: "Bring nature indoors with curated plant arrangements for homes, offices, and retail spaces that boost air quality and mood.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600",
  },
];

const PROCESS = [
  { step: "1", title: "Site Visit", desc: "Our team visits your space to understand the layout, light, and your vision." },
  { step: "2", title: "Design & Approval", desc: "We create a custom design plan and walk you through it before anything starts." },
  { step: "3", title: "Review & Approval", desc: "Final adjustments are made based on your feedback until you're fully satisfied." },
  { step: "4", title: "Installation & Ongoing Care", desc: "Our crew installs the design and offers ongoing maintenance plans to keep it thriving." },
];

export default function GardenServicesPage() {
  return (
    <div>
      <section className="bg-sand-100 py-16">
        <div className="container-px mx-auto text-center max-w-2xl">
          <h1 className="font-display text-4xl text-forest-800 mb-4">Garden Services</h1>
          <p className="text-forest-600">
            From a single balcony to a full commercial property, PlantPlanet's Wah Green
            Nurseries team designs, installs, and maintains green spaces that last.
          </p>
        </div>
      </section>

      <section className="container-px mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {SERVICES.map((s) => (
          <div key={s.title} className="card overflow-hidden">
            <div className="relative h-48">
              <Image src={s.image} alt={s.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <s.icon className="text-forest-600 mb-3" size={28} />
              <h3 className="font-medium text-lg text-forest-800 mb-2">{s.title}</h3>
              <p className="text-sm text-forest-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-forest-900 text-sand-50 py-16">
        <div className="container-px mx-auto">
          <h2 className="font-display text-2xl text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS.map((p) => (
              <div key={p.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gold-500 text-forest-900 font-semibold flex items-center justify-center mx-auto mb-4">
                  {p.step}
                </div>
                <h4 className="font-medium mb-2">{p.title}</h4>
                <p className="text-sm text-sand-300">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-px mx-auto py-16 max-w-2xl">
        <h2 className="font-display text-2xl text-forest-800 text-center mb-8">
          Get Your Free Quote
        </h2>
        <QuoteForm />
      </section>
    </div>
  );
}
