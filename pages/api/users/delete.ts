import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const pool = require("../../../lib/db");
    const query = req.query;
    const { id } = query;

    try {
      if (id) {
        const results = await pool.query("DELETE FROM USERS WHERE id = $1", [
          id,
        ]);
        return res.status(200).json({
          success: true,
          status: 200,
          message: "User deleted successfully",
          data: results.rows,
        });
      } else {
        return res.status(400).json({
          success: false,
          status: 400,
          message: "Bad request",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Internal server error",
      });
    }
  } else {
    res.status(405).json({
      success: false,
      status: 405,
      message: "Method not allowed",
    });
  }
}
