import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";
import fs from "fs";
import { promisify } from "util";
import path from "path";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) throw Error("File upload wrong !!");

  const fileExt = file.name.split(".").slice(-1);
  const newFileName = uniqid() + "." + fileExt;

  const chunks = [];
  for await (const chunk of file.stream()) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  // with s3
  // const s3Client = new S3Client({
  //   region: process.env.AWS_REGION,
  //   credentials: {
  //     accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  //     secretAccessKey: process.env.MY_AWS_SECRET_KEY,
  //   },
  // });

  // s3Client.send(
  //   new PutObjectCommand({
  //     Bucket: process.env.AWS_BUCKET,
  //     Key: newFileName,
  //     ACL: "public-read",
  //     ContentType: file.type,
  //     Body: buffer,
  //   })
  // );
  // const link = process.env.APP_URL + "upload.png";

  // return Response.json(link);

  // with Storage local file
  const writeFileAsync = promisify(fs.writeFile);
  const storeagePath = path.join("./public/uploads/", newFileName);
  const resPath = process.env.APP_URL + "uploads/" + newFileName;
  try {
    await writeFileAsync(storeagePath, buffer);
    return Response.json(resPath);
  } catch (error) {
    return Response.json("Error saving file:", error);
  }
}
