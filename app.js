const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.static('public'));
let Items=[];
let workItems = [];

app.get('/',function(req,res){
    var day = date.getDay();
    res.render('list', {listTitle: day,newListItem: Items});
   
});

app.post('/',function(req,res){
 let listItem = req.body.newItem;
console.log(req.body);
 if(req.body.list === "Work")
 {
    workItems.push(listItem);
    res.redirect('/work');
 }
 else{
 Items.push(listItem);
    res.redirect('/');}
});

app.get('/work',function(req,res){

    res.render('list',{listTitle: "Work",newListItem:workItems});
    
});

app.post('/work',function(req,res){
    var workItem = req.body.listItem;
    console.log(workItem);

    // res.redirect('/');
})

app.get('/about',function(req,res){
    res.render('about');
});

app.listen(3000,function(){
    console.log('listening on port 3000');
});