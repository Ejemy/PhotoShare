const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
const uploadRouter = require('./router');

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
    return res.send({valid: true, id: req.body.id})
  }
  return res.send({error: "Incorrect login information haha"})
})

app.get("/12345/main", (req,res)=>{
  res.render("main")
})




app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



//figure out how to not need a file key for service.js