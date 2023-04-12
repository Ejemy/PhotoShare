
const { google } = require('googleapis');
require('dotenv').config();
const axios = require('axios');

const keyUrl = process.env.FILEKEY;

const response = await axios.get(keyUrl);

const key = response.data;

const getDriveService = () => {
  const KEYFILEPATH = key;
  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: 'v3', auth });
  return driveService;
};

module.exports = getDriveService;