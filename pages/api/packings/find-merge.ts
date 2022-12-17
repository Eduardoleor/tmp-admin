import type { NextApiRequest, NextApiResponse } from "next";

const processParts = async (rows: any) => {
  const process = rows.map((row: any) => {
    const qty = Number(row.qty);
    if (qty > 1) {
      const newRows = [];
      for (let i = 0; i < qty; i++) {
        newRows.push({
          ...row,
          qty: 1,
        });
      }
      return newRows;
    }
    return [row];
  });
  return process[0];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = require("../../../lib/db");
  try {
    const query = req.query;
    const { id } = query;
    if (id) {
      const allTasks = await pool.query(
        "SELECT * FROM WEEKLY_INVENTORY WHERE packingdiskno = $1",
        [id]
      );

      const tasks = allTasks.rows;
      if (tasks.length > 0) {
        const arrOfPromises = tasks.map(async (task: any) => {
          const resultParts = await pool.query(
            "SELECT * FROM WEEKLY_INVENTORY WHERE packingdiskno = $1 AND partnumber = $2",
            [id, task.partnumber]
          );
          return {
            ...task,
            parts: await processParts(resultParts.rows),
          };
        });
        const data = await Promise.all(arrOfPromises);
        const filteredData = data.filter((item: any) => Number(item.qty) > 0);

        return res.status(200).json(filteredData);
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
