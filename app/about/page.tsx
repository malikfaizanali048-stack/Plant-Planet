import Image from "next/image";
import Link from "next/link";
import { Leaf, Truck, ShieldCheck, Heart } from "lucide-react";

const WHY_US = [
  { icon: Leaf, title: "Healthy, Quality Plants", desc: "Every plant is nursery-grown and inspected before it reaches you." },
  { icon: Truck, title: "Fast, Careful Delivery", desc: "Free delivery on orders above Rs. 5000, packed to survive the journey." },
  { icon: ShieldCheck, title: "Expert Garden Advice", desc: "Our team helps you pick the right plants for your space and climate." },
  { icon: Heart, title: "Customer-First Service", desc: "From order to aftercare, we're here to help your garden thrive." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[380px]">
        <Image
          src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200"
          alt="Nursery greenhouse"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-forest-900/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-4xl text-white mb-4">About PlantPlanet</h1>
          <p className="text-sand-100 max-w-xl mb-6">
            By Wah Green Nurseries — cultivating greener homes and spaces across Pakistan.
          </p>
          <Link href="/shop" className="btn-primary">Shop Plants</Link>
        </div>
      </section>

      <section className="container-px mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-2xl text-forest-800 mb-4">Our Story</h2>
          <p className="text-forest-600 leading-relaxed mb-4">
            PlantPlanet grew out of Wah Green Nurseries, a family-run nursery dedicated to
            bringing quality plants and thoughtful garden design to communities across
            Pakistan. What started as a small local nursery has grown into an online
            destination for plant lovers, home gardeners, and businesses alike.
          </p>
          <p className="text-forest-600 leading-relaxed">
            Today, we combine our years of hands-on nursery experience with a simple online
            shopping experience — so getting healthy plants delivered to your door, or booking
            a full garden makeover, is just a few clicks away.
          </p>
        </div>
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=700"
            alt="Nursery worker with plants"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-sand-100 py-16">
        <div className="container-px mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="card p-8">
            <h3 className="font-display text-xl text-forest-800 mb-3">Our Mission</h3>
            <p className="text-forest-600 leading-relaxed">
              To make it easy for every household and business in Pakistan to access quality
              plants, expert garden design, and dependable after-care — at a fair price.
            </p>
          </div>
          <div className="card p-8">
            <h3 className="font-display text-xl text-forest-800 mb-3">Our Vision</h3>
            <p className="text-forest-600 leading-relaxed">
              A greener Pakistan, one garden at a time — where healthy plants and thoughtful
              landscaping are part of every home and workplace.
            </p>
          </div>
        </div>
      </section>

      <section className="container-px mx-auto py-16">
        <h2 className="font-display text-2xl text-forest-800 text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_US.map((w) => (
            <div key={w.title} className="text-center">
              <div className="w-14 h-14 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-4">
                <w.icon className="text-forest-700" size={26} />
              </div>
              <h4 className="font-medium text-forest-800 mb-2">{w.title}</h4>
              <p className="text-sm text-forest-500">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
