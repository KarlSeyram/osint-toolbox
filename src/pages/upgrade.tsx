import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";
import { Terminal, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PaystackPayment = dynamic(() => import("../components/PaystackButton"), {
  ssr: false,
});

export default function Upgrade() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Upgrade Your Account</title>
      </Head>

      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Upgrade to Premium</h1>
          <p className="text-gray-600 mb-6">
            Unlock all premium tools by paying <span className="font-semibold">GHS 10</span>.
          </p>

          {user && <PaystackPayment email={user.email} userId={user.id} />}

          <p className="mt-4 text-sm text-gray-500">
            You will be redirected after successful payment.
          </p>
        </div>

        {/* ✅ Footer */}
        <footer className="mt-12 w-full border-t border-gray-300 pt-4 text-sm text-center text-gray-500">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>OSINT Toolbox v2.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span>© 2025 Karl Software</span>
              <Badge variant="outline" className="gap-1">
                <Lock className="w-3 h-3" />
                Secure
              </Badge>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
