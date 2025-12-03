import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { join } from "path";
import { localData } from "../models/local-data";
import { existsSync } from "fs";
import { getFiles } from "../models/files";
export function uploadFile(req: Request, res: Response) {
  console.log("uploadFile");
  console.log(req.files);
  if (!req.files) {
    res
      .status(400)
      .json({ code: "empty-file", id: "", message: "bad request" });
    return;
  }

  const files = req.files as fileUpload.FileArray;
  const file = files.file as fileUpload.UploadedFile;

  if (!file) {
    res
      .status(400)
      .json({ code: "empty-file", id: "", message: "not receive file" });
    return;
  }

  const filePath = join(localData(), "uploads", file.name);
  if (existsSync(filePath)) {
    res
      .status(400)
      .json({ code: "invalid-file", id: "", message: "file exists" });
    return;
  }

  file.mv(filePath, (err) => {
    if (err) {
      res.status(500).json({
        code: "update-file-error",
        id: "",
        message: "fail to save file",
      });
    } else {
      res.status(200).json({
        code: "user-file-created",
        id: "",
        message: "receive file",
      });
    }
  });
}

export async function getUploads(req: Request, res: Response) {
  const files = await getFiles(join(localData(), "uploads"));

  if (files.length === 0) {
    res
      .status(400)
      .json({ code: "empty-file", id: "", message: "not found files" });
  } else {
    res.status(200).json(files);
  }
}
