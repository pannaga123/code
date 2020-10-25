//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();
const port = 3000;
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//db config
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});
//user schema
const userSchema = new mongoose.Schema({//for ecryption we use mongoose.Schema
    email:String,
    password:String
    
});


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] });


//model of userSchema
const User = new mongoose.model("User",userSchema);


//body get
app.get("/", function (req, res) {
  res.render("home");
});

//body login get
app.get("/login", function (req, res) {
  res.render("login");
});

//body register get
app.get("/register", function (req, res) {
  res.render("register");
});

//register post.
 app.post("/register",function(req,res){
     const newUser = new User({
         email:req.body.username,
         password:req.body.password
     });
     newUser.save(function(err){
         if (err){
            console.log(err);
         }else{
             res.render("secrets");
         }
     });
 });

//login post
app.post("/login",function(req,res){
   const username = req.body.username;
   const password = req.body.password;
    // checking username and password is correct or not by register is correct in login.
   User.findOne({email:username},function(err,founduser){
       if(err){
           console.log(err);
       }else{
           if(founduser){
               if(founduser.password === password){
                   res.render("secrets");
               }
           }
       }
   });
});
 

app.listen(port, function () {
  console.log("server started in the port " + port);
});
