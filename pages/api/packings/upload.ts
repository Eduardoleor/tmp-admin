import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import xlsx from "node-xlsx";
import { v4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method?.toLocaleLowerCase() !== "post") {
    return res.status(400).send({
      success: false,
      status: 400,
      message: "Bad Request",
    });
  }

  const form = new multiparty.Form();
  const data: any = await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      if (err) reject({ err });
      resolve({ fields, files });
    });
  });

  const files = data.files;
  const file = files.blob[0];

  if (file?.size > 0) {
    const fileObj = xlsx.parse(file.path);
    const parseFile = fileObj[0].data;
    const [, ...rows] = parseFile;
    if (rows.length > 0) {
      const pool = require("../../../lib/db");

      try {
        rows.map(async (item: any, index: number) => {
          await pool.query(
            "INSERT INTO WEEKLY_INVENTORY(ID, PartNumber, BuildSequence, BalloonNumber, Qty, PONo, VendorNo, PackingDiskNo, Linea, UpdateAt, ScannedBy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
            [
              v4(),
              item[0],
              item[1] ?? 0,
              item[2] ?? 0,
              item[3] ?? 0,
              item[4] ? item[4] : 0,
              item[5] ?? 0,
              item[6] ?? 0,
              item[7],
              new Date(),
              0,
            ]
          );
        });
        return res.status(200).json({
          success: true,
          status: 200,
          message: "The file was successfully updated",
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          status: 500,
          message: err,
        });
      }
    }

    return res.status(400).json({
      success: false,
      status: 400,
      message: "This file is empty",
    });
  }

  return res.status(500).json({
    success: false,
    status: 500,
    message: "Internal Server Error",
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
