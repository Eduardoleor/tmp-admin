import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toLocaleLowerCase() === "put") {
    const pool = require("../../../lib/db");
    const query = req.query;
    const { id, user_id, full_name } = query;

    try {
      if (id && user_id && full_name) {
        const results = await pool.query(
          "UPDATE USERS SET user_id = $1, full_name = $2  WHERE id = $3",
          [user_id, full_name, id]
        );
        return res.status(200).json({
          success: true,
          status: 200,
          message: "User updated successfully",
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
