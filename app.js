const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/ToDoListDB", {
  useNewUrlParser: true,
});

const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Welcome to ToDoList",
});
const item2 = new Item({
  name: "Hit the + button to add an item",
});
const item3 = new Item({
  name: "<-- hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  
  Item.find({})
    .then(function (foundItems) {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("Successfully saved into our DB.");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
   
});

app.post("/", function (req, res) {
  let itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
  }
  List.findOne({ name: listName })
    .then(function (foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + foundList.name);
    })
    .catch(function (err) {
      console.log("Error");
    });
});

app.get("/:customListName", function (req, res) {
  if (req.params.customListName != "favicon.ico") {
   
  const customListName = lodash.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then(function (foundItems) {

      if (!foundItems) {
        //create a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        res.redirect("/" + customListName);
      }
       else{
         // show existing list
         res.render("list", {
          listTitle: foundItems.name,
          newListItems: foundItems.items,
        });
       }
       console.log(foundItems);
    })
    .catch(function (err) {
      console.log("error");
    });}
});

 
app.post("/delete", function(req, res){
  const checkedListName = req.body.listName;
  const checkedItemId = req.body.checkbox;

  if(checkedListName==="Today"){
    //In the default list
    del().catch(err => console.log(err));

    async function del(){
      await Item.deleteOne({_id: checkedItemId});
      res.redirect("/");
    }
  } else{
    //In the custom list

    update().catch(err => console.log(err));

    async function update(){
      await List.findOneAndUpdate({name: checkedListName}, {$pull: {items: {_id: checkedItemId}}});
      res.redirect("/" + checkedListName);
    }
  }

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("listening on port 3000");
});
