import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = require("../../../lib/db");
  try {
    const query = req.query;
    const { id, part } = query;
    if (id) {
      const allTasks = await pool.query(
        "SELECT * FROM WEEKLY_INVENTORY WHERE packingdiskno = $1 AND partnumber = $2",
        [id, part]
      );
      return res.status(200).json(allTasks.rows);
    }
    return res.status(400).json({
      message: "Bad Request",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
