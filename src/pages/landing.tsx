import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push("/login");

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Check if user is in premium_users table
      if (user && user.email) {
        const { data, error } = await supabase
          .from("premium_users")
          .select("*")
          .eq("email", user.email)
          .single();

        if (data) setIsPremium(true);
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome, {user?.email}</p>

        {isPremium ? (
          <>
            <h2 className="text-green-600 font-semibold text-xl mb-4">🎉 You are a Premium User!</h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 rounded">Premium Tool 1</button>
              <button className="w-full bg-blue-600 text-white py-2 rounded">Premium Tool 2</button>
              <button className="w-full bg-blue-600 text-white py-2 rounded">Premium Tool 3</button>
            </div>
          </>
        ) : (
          <>
            <p className="text-yellow-600 mb-4">You’re on the free tier. Upgrade to unlock all features.</p>
            <a
              href="/upgrade"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Upgrade to Premium
            </a>
          </>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 inline-block bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
