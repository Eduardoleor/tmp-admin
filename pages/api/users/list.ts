import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const pool = require("../../../lib/db");

    try {
      const usersList = await pool.query("SELECT * FROM USERS");
      const filterUsers = usersList.rows?.map((user: any) => {
        return {
          id: user.id,
          user_id: user.user_id,
          full_name: user.full_name,
          role: user.role,
          jwt: user.jwt,
          is_active: user.is_active,
        };
      });
      return res.status(200).json({
        success: true,
        status: 200,
        data: filterUsers,
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
