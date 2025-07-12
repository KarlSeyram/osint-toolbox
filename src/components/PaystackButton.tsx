"use client";
import React from "react";
import { useRouter } from "next/router";
import { PaystackButton } from "react-paystack";
import { supabase } from "@/lib/supabaseClient";

const PaystackPayment = ({ email, userId }: { email: string, userId: string }) => {
  const router = useRouter();

  const publicKey = "pk_live_d94cc6d8172b21877e7e7893283dd2ecd49e897d"; // Replace with real key
  const amount = 2000 * 100;

  const handleSuccess = async (ref: any) => {
    try {
      // 1. Store payment info
      await supabase.from("payments").insert([
        {
          user_id: userId,
          email,
          amount,
          reference: ref.reference,
        },
      ]);

      // 2. Mark user as premium
      await supabase.from("profiles").update({ is_premium: true }).eq("id", userId);

      // 3. Redirect
      router.push("/dashboard");
    } catch (error) {
      console.error("Payment update error:", error);
      alert("Payment went through, but something went wrong saving your premium access.");
    }
  };

  const componentProps = {
    email,
    amount,
    publicKey,
    text: "Pay GHS 20",
    onSuccess: handleSuccess,
    onClose: () => alert("Payment closed"),
  };

  return <PaystackButton {...componentProps} />;
};

export default PaystackPayment;
