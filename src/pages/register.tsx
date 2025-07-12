import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert("✅ Account created. Please log in.");
      router.push("/login");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center px-4 hacker-bg">
    <div className="bg-black p-8 rounded-xl shadow-md max-w-md w-full text-center border border-green-500">
      <h1 className="text-2xl font-bold mb-2 text-green-400">Create an Account</h1>
      <p className="text-green-300 mb-6">Join OSINT and unlock premium features</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md text-black-500 bg-black border-black-400 placeholder-black-400 focus:outline-none focus:ring-2 focus:ring-black-500"
      />

      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 mb-6 border rounded-md text-black-500 bg-black border-black-400 placeholder-black-400 focus:outline-none focus:ring-2 focus:ring-black-500"
      />

      <button
        onClick={handleRegister}
        className="w-full bg-green-700 text-black py-2 rounded-md hover:bg-green-600 transition"
      >
        Register
      </button>

      <p className="mt-4 text-sm text-black-300">
        Already have an account?{" "}
        <a href="/login" className="text-green-400 hover:underline">
          Login
        </a>
      </p>
    </div>
  </div>
);


      {/* ✅ Footer */}
      <p className="mt-6 text-sm text-green-400 text-center">
        © 2025 Karl Software. All rights reserved.
      </p>
    </div>
  );
}
