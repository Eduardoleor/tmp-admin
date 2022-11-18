import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const pool = require("../../../lib/db");
    const query = req.query;
    const {
      id,
      user_id,
      full_name,
      password,
      role,
      jwt,
      sign_date,
      is_active,
    } = query;

    try {
      if (
        id &&
        user_id &&
        full_name &&
        password &&
        role &&
        jwt &&
        sign_date &&
        is_active
      ) {
        const results = await pool.query(
          "INSERT INTO USERS(ID, USER_ID, FULL_NAME, PASSWORD, ROLE, JWT, SIGN_DATE, IS_ACTIVE) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [id, user_id, full_name, password, role, jwt, sign_date, is_active]
        );
        return res.status(200).json({
          success: true,
          status: 200,
          message: "New user added",
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
      console.log(error);
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
