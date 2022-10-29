import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toLocaleLowerCase() === "post") {
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
          "INSERT INTO WEEKLY_INVENTORY(ID, PartNumber, BuildSequence, BalloonNumber, Qty, PONo, VendorNo, PackingDiskNo, Linea, UpdateAt, ScannedBy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
          [
            String(id),
            String(partnumber),
            Number(buildsequence),
            String(balloonnumber),
            Number(qty),
            Number(pono),
            Number(vendorno),
            Number(packingdiskno),
            String(linea),
            new Date(updateat as string),
            Number(scannedby),
          ]
        );
        return res.status(200).json({
          success: true,
          status: 200,
          message: "New item added",
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
