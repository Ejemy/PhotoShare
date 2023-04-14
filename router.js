// router.js

const stream = require('stream');
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');

const uploadRouter = express.Router();
const upload = multer();
const getDriveService = require('./service.js');


const uploadFile = async (fileObject) => {
  const driveService = getDriveService();
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await driveService.files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: ['1GERGlmnrbIQyJquURzI1kRJHM6KX39aE'],
    },
    fields: 'id,name',
  });
  console.log(`Uploaded file ${data.name} ${data.id}`);
  console.log("This is after line 28 of router.js")
};

uploadRouter.post('/upload', upload.any(), async (req, res) => {
  try {
    const files = req.body;
    console.log(files)
    await uploadFile(files);
    //this could be for uploading multiple? But I cant define length...
    /*for (let f = 0; f < files.length; f += 1) {
      await uploadFile(files[f]);
    } */

    res.status(200).send('Form Submitted');
  } catch (f) {
    res.send(f.message);
  }
});

module.exports = uploadRouter;