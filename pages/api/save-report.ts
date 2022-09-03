// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";

type Data = {
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //if (req.method !== "POST") {
  //res.status(405).send({ message: "Only POST requests allowed" });
  //return;
  //}

  //const pool = require("../../lib/db");

  //try {
  //const allTasks = await pool.query("SELECT * FROM WEEKLY_INVENTORY");
  //return res.status(200).json(allTasks.rows);

  //console.log(req.body)

  //return res.status(200).json({ message: "John Doe" });
  //} catch (error) {
  //console.log({ error });
  //}

  const form = new multiparty.Form();
  const data = await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      if (err) reject({ err });
      resolve({ fields, files });
    });
  });

  console.log(`Form data: `, data);

  return res.status(200).json(data);

  res.status(200).json({ message: "John" });
}

export const config = {
  //api: {
  //bodyParser: {
  //sizeLimit: "4mb", // Set desired value here
  //},
  //},
  api: {
    bodyParser: false,
  },
};
