import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toLocaleLowerCase() === "put") {
    const pool = require("../../../../lib/db");
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
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Updated successfully",
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
