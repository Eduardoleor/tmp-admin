import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = req.query.user;
  const password = req.query.password;

  if (
    req.method?.toLocaleLowerCase() === "get" &&
    user_id?.length &&
    password?.length
  ) {
    const pool = require("../../../lib/db");

    try {
      const user = await pool.query("SELECT * FROM USERS WHERE USER_ID = $1", [
        user_id,
      ]);

      if (user.rows.length === 0) {
        return res.status(401).json({
          success: false,
          status: 401,
          message: "User not found",
        });
      }

      const doesPasswordMatch = bcrypt.compareSync(
        password as string,
        user.rows[0].password
      );

      if (doesPasswordMatch) {
        if (user.rows[0].is_active) {
          if (user.rows[0].role === "administrator") {
            return res.status(200).json({
              success: true,
              status: 200,
              message: "User found",
              user: user.rows[0],
            });
          } else {
            return res.status(401).json({
              success: false,
              status: 401,
              message: "User not authorized",
            });
          }
        } else {
          return res.status(401).json({
            success: false,
            status: 401,
            message: "User is not active",
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          status: 401,
          message: "Incorrect password",
        });
      }
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
