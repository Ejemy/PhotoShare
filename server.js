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
  //function to check DB
  /*if(!FUNCTIONTHING){
    return res.send({error: "Sorry, incorrect login information."})
  }
  return res.send({valid:FUNCTIONTHING});

*/
  return res.send({error: "haha"})
})
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
