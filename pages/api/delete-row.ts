// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = require("../../lib/db");
  const query = req.query;
  const { part, packing } = query;

  try {
    if (part && packing) {
      await pool.query(
        "DELETE FROM WEEKLY_INVENTORY WHERE PartNumber = $1 AND PackingDiskNo = $2",
        [part, packing]
      );
      return res.status(200).json({ message: "success" });
    }
    return res.status(400).json({ message: "Error on delete row" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
