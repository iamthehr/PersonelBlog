const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const ejs = require("ejs");

const mongoose=require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser: true});

const contentSchmea=new mongoose.Schema({
  name:String,
  ContentBLog:String
})

const Post=mongoose.model("Post",contentSchmea)

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {

  Post.find(function(err,AllPosts){
  res.render("home", { HCon: homeStartingContent, AllPosts:AllPosts});
  })
});
app.get("/posts/:page", function (req, res) {
  let TitlePost = "Not Found";
  let ContentPost = "Not Found";

  Post.find(function(err,Posts){
  for (var i = 0; i < Posts.length; i++) {
    // console.log(_.lowerCase(Posts[i].name))
    // console.log( _.lowerCase(req.params.page))
    if (_.lowerCase(Posts[i].name) == _.lowerCase(req.params.page)){
      res.render("post", {Posts:Posts[i]});
    }
  }
})
  
});
app.get("/about", function (req, res) {
  res.render("about", { ACon: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { CCon: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

var id;
app.get("/edit",function(req,res){
  Post.findById(id,function(err,item){
    res.render("edit",{Posts:item})

  })

})
app.post("/edit",function(req,res){
    id=req.body.btn;
    res.redirect("/edit")
})

app.post("/", function (req, res) {
  // console.log(req.body.btn);
  if(req.body.btn=="edit"){
    Post.updateOne({_id:id},{name:req.body.titleBody,
      ContentBLog:req.body.postBody},function(err){
      if(err){
        console.log(err);
      }
      res.redirect("/"); 
    })
  }
  else{
  const newPost = new Post({
    name: req.body.titleBody,
    ContentBLog: req.body.postBody,
  });
  newPost.save();
  res.redirect("/");
} 
});

app.post("/delete",function(req,res){
     const postID=req.body.btn;
     Post.findByIdAndRemove(postID,function(err){
      if(err){
        console.log(err);
      }
     })
     res.redirect("/")

})

app.listen(3000, function () {
  console.log("Server is running..");
});
