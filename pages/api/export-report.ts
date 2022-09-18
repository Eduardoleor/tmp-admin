// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  const { id } = query;

  try {
    if (id && id.length) {
      const pool = require("../../lib/db");
      const allTasks = await pool.query(
        "SELECT * FROM WEEKLY_INVENTORY WHERE PackingDiskNo = $1",
        [id]
      );
      if (allTasks?.rows.length) {
        const { rows } = allTasks;
        const items = rows.filter((value: any) => Number(value.qty) > 0);
        if (items?.length) {
          const doc = new PDFDocument();
          doc.pipe(fs.createWriteStream(`file-${id}.pdf`));
          doc
            .fontSize(27)
            .text(
              `Kit ${id} has NOT been fully verified. Those items not fully verified are list below.`,
              100,
              100
            );
          doc.text("", 100, 220);
          if (items.length > 0) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              doc
                .fontSize(15)
                .text(
                  `ID: ${i + 1} Item: ${item.packingdiskno} - part: ${
                    item.partnumber
                  } - qty: ${item.qty}`
                );
              doc.moveDown(1);
            }
          }
          doc.end();

          res.setHeader("Content-Type", "application/pdf");
          return res.send(doc);
        } else {
          const doc = new PDFDocument();
          doc.pipe(fs.createWriteStream(`file-${id}.pdf`));
          doc.fontSize(27).text(`Kit ${id} has been fully verified`, 100, 100);
          doc.fontSize(15).text(`Date: ${new Date()}`, 100, 200);
          doc.end();
          res.setHeader("Content-Type", "application/pdf");
          return res.send(doc);
        }
      }
      return res.status(404).json({ message: "Not found ID" });
    }

    return res.status(400).json({ message: "There was a error" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
