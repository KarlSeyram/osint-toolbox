// components/DashboardLayout.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // components/DashboardLayout.tsx (or wherever your layout is)
import Header from "./Header";
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-4">{children}</main>
    </div>
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-300">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-green-400 font-mono">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-green-700 bg-black">
        <h1 className="text-2xl">KarlSoftwares</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:inline">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-400"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
