// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pool = require("../../lib/db");
  const query = req.query;
  const {
    id,
    balloonnumber,
    buildsequence,
    linea,
    packingdiskno,
    partnumber,
    pono,
    qty,
    vendorno,
    scannedby,
    updateat,
  } = query;

  try {
    if (
      id &&
      balloonnumber &&
      buildsequence &&
      linea &&
      packingdiskno &&
      partnumber &&
      pono &&
      qty &&
      vendorno &&
      scannedby &&
      updateat
    ) {
      console.log("EXCUTE");
      const results = await pool.query(
        "UPDATE WEEKLY_INVENTORY SET balloonnumber = $1, buildsequence = $2, linea = $3, packingdiskno = $4, partnumber = $5, pono = $6, qty = $7, vendorno = $8, scannedby = $9, updateat = $10 WHERE id = $11",
        [
          balloonnumber,
          buildsequence,
          linea,
          packingdiskno,
          partnumber,
          pono,
          qty,
          vendorno,
          scannedby,
          new Date(),
          id,
        ]
      );
      console.log("END");
      return res.status(200).json(results.rows);
    }
    return res.status(400).json({ message: "Error on delete row" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
