/**
 * Seed script — populates sample plants + creates your admin login.
 * Run with: npm run seed
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const ProductSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

const products = [
  {
    name: "Fiddle Leaf Fig",
    category: "Indoor",
    price: 3500,
    discountPercent: 10,
    description: "A statement indoor plant with large, glossy violin-shaped leaves. Loves bright, indirect light.",
    images: ["https://images.unsplash.com/photo-1597055181449-b9d5f3d5b5f5?w=600"],
    stock: 20,
    isHotDeal: true,
  },
  {
    name: "Snake Plant",
    category: "Indoor",
    price: 1800,
    discountPercent: 0,
    description: "Nearly indestructible, air-purifying, and thrives on neglect. Perfect for beginners.",
    images: ["https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=600"],
    stock: 40,
    isHotDeal: false,
  },
  {
    name: "Money Plant (Pothos)",
    category: "Indoor",
    price: 900,
    discountPercent: 15,
    description: "Trailing vine known for good luck and easy care — ideal for shelves and hanging baskets.",
    images: ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600"],
    stock: 60,
    isHotDeal: true,
  },
  {
    name: "Areca Palm",
    category: "Outdoor",
    price: 4200,
    discountPercent: 0,
    description: "Elegant feathery palm that adds a tropical feel to gardens and patios.",
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"],
    stock: 15,
    isHotDeal: false,
  },
  {
    name: "Bougainvillea",
    category: "Outdoor",
    price: 1200,
    discountPercent: 20,
    description: "Vibrant flowering vine that thrives in Pakistan's sun — great for boundary walls and pergolas.",
    images: ["https://images.unsplash.com/photo-1524598171353-e0d1c5b7e0c7?w=600"],
    stock: 30,
    isHotDeal: true,
  },
  {
    name: "Mango Sapling",
    category: "Fruit Trees",
    price: 2500,
    discountPercent: 0,
    description: "Grafted mango sapling, fruits within 3-4 years. Chaunsa variety.",
    images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?w=600"],
    stock: 12,
    isHotDeal: false,
  },
  {
    name: "Lemon Tree",
    category: "Fruit Trees",
    price: 2200,
    discountPercent: 10,
    description: "Compact citrus tree, produces fragrant blossoms and juicy lemons year-round.",
    images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600"],
    stock: 18,
    isHotDeal: false,
  },
  {
    name: "Basil Herb Pot",
    category: "Herbs & Seeds",
    price: 450,
    discountPercent: 0,
    description: "Fresh basil ready to harvest — perfect for the kitchen windowsill.",
    images: ["https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600"],
    stock: 50,
    isHotDeal: false,
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  const inserted = await Product.insertMany(
    products.map((p) => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }))
  );
  console.log(`Seeded ${inserted.length} products`);

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@plantplanet.pk").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";

  await User.deleteOne({ email: adminEmail });
  const hashed = await bcrypt.hash(adminPassword, 10);
  await User.create({ name: "Admin", email: adminEmail, password: hashed, role: "admin" });
  console.log(`Admin account ready → ${adminEmail} / ${adminPassword}`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
