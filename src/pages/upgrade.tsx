import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabaseClient";

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

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">Upgrade to Premium</h1>
          <p className="text-gray-600 mb-6">
            Unlock all premium tools by paying <span className="font-semibold">GHS 20</span>.
          </p>

          {user && <PaystackPayment email={user.email} userId={user.id} />}

          <p className="mt-4 text-sm text-gray-500">
            You will be redirected after successful payment.
          </p>
        </div>
      </div>
    </>
  );
}
