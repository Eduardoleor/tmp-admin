import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = require("../../../lib/db");
  try {
    const query = req.query;
    const { id, user } = query;

    if (id && user) {
      const allTasks = await pool.query(
        "SELECT * FROM WEEKLY_INVENTORY WHERE ID = $1",
        [id]
      );

      const tasks = allTasks.rows;
      if (tasks.length > 0) {
        const qty = Number(tasks[0].qty);
        if (qty > 0) {
          const newQty = qty - 1;
          await pool.query(
            "UPDATE WEEKLY_INVENTORY SET qty = $1, scannedby = $2 WHERE id = $3",
            [newQty, user, id]
          );
          return res.status(200).json({
            message: "Success",
          });
        }
        return res.status(400).json({
          message: "Bad Request",
        });
      }
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
