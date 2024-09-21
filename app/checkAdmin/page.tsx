"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

const CheckAdmin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/checkAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, adminCode }),
      });

      const result = await response.json();

      if (result.success) {
        router.push(result.redirectUrl); // Redirect to /admin
      } else {
        setError("Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-700">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <Image
            src="/assets/icons/adminLogin.png"
            height={150}
            width={200}
            alt="logo"
            className="w-fit h-fit mt-0 mb-2 mx-auto"
          />

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your Password"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Admin Code
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                placeholder="Admin Code"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckAdmin;
