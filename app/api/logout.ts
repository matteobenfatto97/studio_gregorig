// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Clear the cookie by setting it with an empty value and Max-Age to 0
    res.setHeader("Set-Cookie", "adminToken=; HttpOnly; Path=/; Max-Age=0;");
    res.status(200).json({ success: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
