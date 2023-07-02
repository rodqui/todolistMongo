const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");



const app = express();
const port = 3000;
const dirname = __dirname;

const items = [];
const workItems = [];

//View engine EJS started
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    const day = date.getWeekDay();    
    res.render("list", {listTitle: day, listOfItems: items});
    
});

 
app.post("/", (req, res)=>{
    
    const item = req.body.item;
    if(req.body.listForm==="Work"){
       workItems.push(item);
       res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
    

});


app.get("/work", (req, res)=>{
    res.render("list",{listTitle: "Work", listOfItems: workItems});
});


app.listen(port,()=>{
    console.log("server started on port "+port);
});




