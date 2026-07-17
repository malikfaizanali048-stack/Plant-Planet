"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);

    if (res?.error) {
      toast.error("Invalid credentials or not an admin account");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="container-px mx-auto py-24 max-w-sm">
      <h1 className="font-display text-2xl text-forest-800 mb-6 text-center">Admin Login</h1>
      <div className="card p-6 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-sand-200 rounded-xl px-4 py-3 outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button onClick={handleLogin} disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}
