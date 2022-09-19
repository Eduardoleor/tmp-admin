// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = require("../../lib/db");

  try {
    const allTasks = await pool.query("SELECT * FROM WEEKLY_INVENTORY");
    const { rows } = allTasks;
    if (rows?.length) {
      const items = rows.filter((value: any) => Number(value.qty) > 0);
      return res.json(items);
    }
    return res.status(404).json({ message: "Not records found" });
  } catch (error) {
    return res.status(400).json({ message: "There was a error" });
  }
}
