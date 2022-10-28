import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toLocaleLowerCase() === "delete") {
    const pool = require("../../../lib/db");
    try {
      await pool.query(
        "INSERT INTO WEEKLY_INVENTORY_BU SELECT * FROM WEEKLY_INVENTORY ON CONFLICT DO NOTHING"
      );
      await pool.query("TRUNCATE WEEKLY_INVENTORY");
      return res.status(200).json({
        success: true,
        status: 200,
        message: "Deleted Successfully",
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
