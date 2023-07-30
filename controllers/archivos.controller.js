import { Router } from "express";

export const ArchivosController = Router();

ArchivosController.post("/upload", (req, res, next) => {
    let uploadFile = req.files.file;
    const name = uploadFile.name;
    const md5 = uploadFile.md5();
    const saveAs = `${md5}_${name}`;
    uploadFile.mv(`../public/files/${saveAs}`, function (err) {
        if (err) {
        return res.status(500).send(err);
        }
        return res.status(200).json({ status: "uploaded", name, saveAs });
    });
});
