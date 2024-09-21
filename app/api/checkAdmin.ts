import type { NextApiRequest, NextApiResponse } from "next";
import { checkAdminCredentials } from "@/lib/actions/admin.actions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password, adminCode } = req.body;

  try {
    const admin = await checkAdminCredentials({ email, password, adminCode });

    if (admin) {
      res.status(200).json({ success: true, redirectUrl: "/admin" });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
