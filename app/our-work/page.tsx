import { connectDB } from "@/lib/mongodb";
import Work from "@/models/Work";
import Image from "next/image";

async function getWork() {
  await connectDB();
  const items = await (Work as any).find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export default async function OurWorkPage() {
  const items = await getWork();

  return (
    <div className="container-px mx-auto py-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="font-display text-4xl text-forest-800 mb-4">Our Work</h1>
        <p className="text-forest-600">
          A look at gardens, landscapes, and installations completed by the PlantPlanet /
          Wah Green Nurseries team.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-forest-400 py-16">
          No work has been added yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <div key={item._id} className="card overflow-hidden">
              <div className="relative aspect-video bg-sand-100">
                {item.mediaType === "video" ? (
                  <video
                    src={item.mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                ) : (
                  <Image src={item.mediaUrl} alt={item.title} fill className="object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-forest-800 mb-1">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-forest-500">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}