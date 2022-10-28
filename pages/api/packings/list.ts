import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toLocaleLowerCase() === "get") {
    const pool = require("../../../lib/db");

    try {
      const packingsList = await pool.query("SELECT * FROM WEEKLY_INVENTORY");
      return res.status(200).json({
        success: true,
        status: 200,
        data: packingsList.rows,
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
      message: "Bad Request",
    });
  }
}
