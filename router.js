// router.js

const stream = require("stream");
const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");

const uploadRouter = express.Router();
const upload = multer();
const getDriveService = require("./service.js");
require("dotenv").config();

var imageList = [];
const uploadFile = async (fileObject, unique) => {
  const driveService = await getDriveService();
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await driveService.files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: `${unique}-${fileObject.originalname}`, 
       parents: [process.env.DRIVE_ID],
    },
    fields: "id,name, createdTime, imageMediaMetadata",
  });
  var images = {};
  images.link = data.id;
  images.createdTime = data.createdTime;
  images.imageMediaMetadata = data.imageMediaMetadata;
  imageList.push(images);
  console.log("Grabbing from Google Drive...");
  console.log(
    `Uploaded file ${data.name} ${data.id} ${data.imageMediaMetadata}`
  );
};


uploadRouter.post("/upload", upload.any(), async (req, res) => {
  try {
    const files = req.files;
    const unique = req.query.unique
    //for uploading multiple files
    for (let f = 0; f < files.length; f += 1) {
      await uploadFile(files[f], unique);
    }
    res.set('Cache-Control', 'no-store');
    return res.status(200).send(imageList);

  } catch (f) {
    return res.send(f.message);
  }
});

uploadRouter.get("/firstload", async (req, res) => {
  try {
    const driveService = await getDriveService();
    const query = `'${process.env.DRIVE_ID}' in parents and mimeType contains 'image/'`;
    const response = driveService.files.list({
      q: query,
      fields: "files(id, name, imageMediaMetadata, createdTime)",
    });
    const photos = await response;

    const sendPhotos = photos.data.files.map((file) => ({
      id: file.id,
      name: file.name,
      createdTime: file.createdTime,
      takenTime: file.imageMediaMetadata?.time,
    }));

    const sortedPhotos = sendPhotos.sort(function (a, b) {
      return b.createdTime - a.createdTime;
    });
    //console.log(sortedPhotos);

    res.status(200).json(sortedPhotos);
  } catch (errors) {
    console.log(errors);
    res.status(500).send("Error retrieving photos from Google Drive.");
  }
});

module.exports = uploadRouter;
