// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { AES, enc } from "crypto-js";

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
      const bytes = AES.decrypt(
        password as string,
        process.env.KEY_CYPHER as string
      );
      const decryptedPassword = bytes.toString(enc.Utf8);
      const user = await pool.query(
        "SELECT * FROM USERS WHERE USER_ID = $1 AND PASSWORD = $2",
        [user_id, decryptedPassword]
      );
      if (user.rows.length) {
        return res.status(200).json({
          success: 200,
          status: 200,
          user: user.rows[0],
        });
      } else {
        return res.status(404).json({
          success: false,
          status: 404,
          message: "User not found",
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
