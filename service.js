
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
    return response.data;
  } catch (error) {
    console.error(`Error fetching credentials: ${error}`);
    throw error;
  }
};

const getDriveService = async () => {
  const KEYFILEPATH = await getCredentials();
  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  const auth = await new google.auth.GoogleAuth({
    KeyFile: JSKEYFILEPATH,
    scopes: SCOPES,
  });
  console.log("Auth: ", auth)
  const driveService = google.drive({ version: 'v3', auth });
  return driveService;
};

module.exports = getDriveService;