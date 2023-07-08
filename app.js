const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const lodash = require("lodash");




const app = express();
const port = 3000;
const dirname = __dirname;

//BD
const uri = "mongodb://127.0.0.1:27017/todolistDB";
mongoose.connect(uri);

//Create a new schema
const itemsSchema = new mongoose.Schema({
    name: String
});

//Create a new schema
const listsSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

//create a new model for itemSchema
const Item = mongoose.model("Item", itemsSchema);

//create a new model for listsSchema
const List = mongoose.model("List", listsSchema);


//create a new item
const item2 = new Item({
    name: "Prueba2"
});




//View engine EJS started
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", (req, res)=>{
    const day = date.getWeekDay();  
     
    
    //Query to BD
    async function getItems(){
        const result = await Item.find();
        return result;
    }

    getItems().then(function(foundItems){
        console.log(foundItems);
      
        res.render("list", {listTitle: "Hoy", listOfItems: foundItems});
    });

    
    
});


//custom route
app.get("/category/:customListName", (req, res)=>{
    const customListName = lodash.capitalize(req.params.customListName);
    const day = date.getWeekDay();  
   
    List.findOne({name: customListName}).then(function( result){
        
        if(!result){ //si la lista no esta en la BD, creamos una
           

             //create new item LIST
            const list = new List({
                name: customListName,
                items: []
            });

            //save the list
            list.save();
            console.log("no existe se crea nueva bd y redireccion"+customListName);
            //redirection a la url con la lista que se acaba de crear
            res.redirect("/category/"+customListName);

        }else{
            console.log("Ya existe la bd"+customListName);
            res.render("list", {listTitle: customListName, listOfItems: result.items})
        }

    }).catch(function(err){
        console.log(err);
    });

   
});
 
app.post("/", (req, res)=>{
    
    const item = req.body.item;
    const listName = req.body.listForm;

    //create a new item
    const item1 = new Item({
        name: item
    });

    if(listName==="Hoy"){
           //save into bd
        item1.save();
        res.redirect("/");
    }else{
        List.updateOne({name: listName},{$push: {items: [item1]}}).then(function( result){
            //guardamos el nuevo item a la lista asociada, que es un array, utilizando push

            //redirecciones a la lista custom
            res.redirect("/category/"+listName);
        })
    }
 
  

});

app.post("/delete", (req, res) => {
    console.log(req.body.id);
    const idItem = req.body.id;
    const listName = req.body.listName;
    console.log("listname "+listName);

    if(listName==="Hoy"){

        Item.deleteOne({_id: idItem}).then(function(result){
            //deleteCound: 1 o 0, si es un 1 es que se elimino correcto, 0 es que no
            console.log("Item Deleted!:"+ result.deletedCount);
            res.send("Hoy");
        }).catch(function(err){
            console.log(err);
            return false;
        });
    }else{
        List.findOneAndUpdate({name: listName}, {
            $pull: {
                items: {_id: idItem}
            }, 
            rawResult: true
        }).then(function (result){
            res.send(listName);
            console.log("ITEM QUITADO");
        })
    }
   
});


app.get("/work", (req, res)=>{
    res.render("list",{listTitle: "Work", listOfItems: workItems});
});


app.listen(port,()=>{
    console.log("server started on port "+port);
});




