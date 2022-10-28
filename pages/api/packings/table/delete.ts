// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = require("../../../../lib/db");
  const query = req.query;
  const { part, packing } = query;

  if (req.method?.toLocaleLowerCase() === "delete" && part && packing) {
    try {
      await pool.query(
        "DELETE FROM WEEKLY_INVENTORY WHERE PartNumber = $1 AND PackingDiskNo = $2",
        [part, packing]
      );
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Packing deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Bad request",
    });
  }
}
