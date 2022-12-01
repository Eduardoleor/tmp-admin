import type { NextApiRequest, NextApiResponse } from "next";
import { Base64Encode } from "base64-stream";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

function createDirectories(pathname: string) {
  const __dirname = path.resolve();
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ""); // Remove leading directory markers, and remove ending /file-name.extension
  fs.mkdir(path.resolve(__dirname, pathname), { recursive: true }, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("Success");
    }
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  const { id } = query;

  try {
    if (id && id.length) {
      const pool = require("../../../lib/db");
      const allTasks = await pool.query(
        "SELECT * FROM WEEKLY_INVENTORY WHERE PackingDiskNo = $1",
        [id]
      );
      if (allTasks?.rows.length) {
        await pool.query(
          "UPDATE WEEKLY_INVENTORY SET UpdateAt = $1 WHERE PackingDiskNo = $2",
          [new Date(), id]
        );
        const { rows } = allTasks;
        const items = rows.filter((value: any) => Number(value.qty) > 0);
        if (items?.length) {
          const doc = new PDFDocument();
          var finalString = "";
          var stream = doc.pipe(new Base64Encode());
          createDirectories("/src/reports");

          var dir = fs.createWriteStream(`src/reports/report-${id}.pdf`);
          doc.pipe(dir);
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
                  } - qty: ${item.qty} - date: ${item.updateat}`
                );
              doc.moveDown(1);
            }
          }
          doc.end();

          stream.on("data", function (chunk) {
            finalString += chunk;
          });

          stream.on("end", () => {
            res.json({
              blob: finalString,
            });
          });

          return;
        } else {
          const doc = new PDFDocument();
          var finalString = "";
          var stream = doc.pipe(new Base64Encode());

          doc.pipe(fs.createWriteStream(`file-${id}.pdf`));
          doc.fontSize(27).text(`Kit ${id} has been fully verified`, 100, 100);
          doc.fontSize(15).text(`Date: ${new Date()}`, 100, 200);
          doc.end();

          stream.on("data", function (chunk) {
            finalString += chunk;
          });

          stream.on("end", () => {
            return res.json({
              blob: finalString,
            });
          });

          return;
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
