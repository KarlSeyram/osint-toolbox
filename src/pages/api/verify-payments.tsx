import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient"; // Adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { reference } = req.body;

  if (!reference) {
    return res.status(400).json({ message: "Payment reference is required" });
  }

  try {
    const { data } = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Add this to .env.local
      },
    });

    if (data.status && data.data.status === "success") {
      const email = data.data.customer.email;

      // Save user as premium
      await supabase.from("premium_users").upsert([{ email }]);

      return res.status(200).json({ success: true, data: data.data });
    } else {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
