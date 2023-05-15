
const { google } = require('googleapis');
require('dotenv').config();
const axios = require('axios');

const keyUrl = process.env.FILEKEY; 


const getCredentials = async () => {
  try {
    const response = await axios.get(keyUrl, {
      headers: {
        "X-Master-Key" : process.env.API_KEY
      },
    });
    return response.data.record;
  } catch (error) {
    console.error(`Error fetching credentials: ${error}`);
    throw error;
  }
};

const getDriveService = async () => {
  const KEYFILEPATH = await getCredentials()
  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  const auth = new google.auth.GoogleAuth({
    credentials: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: 'v3', auth });
  const res = await driveService.files.list();
  return driveService;
};

module.exports = getDriveService;