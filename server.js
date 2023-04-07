const express = require('express');
const app = express();
const port = 3000;
const path = require("path");

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "public")))

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => { 
    res.render("login", {title: "This is a title"});
});

app.post("/login", (req,res) => {
  console.log(req.body)
  if(req.body.id == "12345"){
    res.send({valid: true})
  }
  return res.send({error: "Incorrect login information haha"})
})

/app.get("/main", (req,res)=>{
  res.render("main")
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
