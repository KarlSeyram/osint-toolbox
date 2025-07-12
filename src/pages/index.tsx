import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center animate-pulse">
        <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
        <p className="text-sm text-gray-500">Redirecting you securely</p>
      </div>
    </div>
  );
}
