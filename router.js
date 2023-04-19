// router.js

const stream = require('stream');
const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');

const uploadRouter = express.Router();
const upload = multer();
const getDriveService = require('./service.js');
require('dotenv').config();


var id = [];
const uploadFile = async (fileObject) => {
  const driveService = await getDriveService();
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const { data } = await driveService.files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: [process.env.DRIVE_ID],
    },
    fields: 'id,name',
  });
  id.push(data.id)
  console.log(`Uploaded file ${data.name} ${data.id}`);
  
};


uploadRouter.post('/upload', upload.any(), async (req, res) => {
  try {
    console.log("trying upload...")
    const files = req.files;
    //for uploading multiple files
    for (let f = 0; f < files.length; f += 1) {
      await uploadFile(files[f]);
    }
    
    res.status(200).send({"status": "success", "link": id });
  } catch (f) {
    res.send(f.message);
  }
});


uploadRouter.get("/firstload", async(req,res)=>{
  try{
    const driveService = await getDriveService();
    const query = `'${process.env.DRIVE_ID}' in parents and mimeType contains 'image/'`;
    const response = driveService.files.list({
      q: query,
      fields: 'files(id, name)'
    });
    const photos = await response
    console.log("onload photos data", photos.data.files)
    res.status(200).json(photos.data.files)
  } catch(errors){
    console.log(errors);
    res.status(500).send('Error retrieving photos from Google Drive.');
  }
})




module.exports = uploadRouter;