const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
const multer = require('multer');
const upload = multer();


const { OAuth2Client } = require('google-auth-library');
const client_id = 'YOUR_CLIENT_ID';
const client_secret = 'YOUR_CLIENT_SECRET';
const redirect_uri = 'YOUR_REDIRECT_URI';
const oauth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);
const uploadRouter = require('./router');
const getDriveService = require('./service.js');

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "public")))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(uploadRouter);

require('dotenv').config();



app.get('/', (req, res) => { 
    res.render("login", {title: "This is a title"});
});



app.post("/login", (req,res) => {
  if(req.body.id == "12345"){
    return res.send({valid: true})
  }
  return res.send({error: "Incorrect login information haha"})
})

app.get("/main", (req,res)=>{
  res.render("main")
})




app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



//figure out how to not need a file key for service.js