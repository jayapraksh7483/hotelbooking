if(process.env.NODE_ENV !="production")
{
  require("dotenv").config();
}
 


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError=require("./utils/expressError.js");
const session =require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js")




const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const sessionOptions={
  secret:"mysupersecretstring",
  resave:false,
  saveUninitialized:true,
  cookie:{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });
 
 app.use(session(sessionOptions));
 app.use(flash());
 app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());







 app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
   
  next();
 });
 app.get("/demouser", async(req,res)=>{
  let fakeUser= new user({
    email:"student@gmail.com",
    username:"delta-student"
  });
   let newuser= await user.register(fakeUser,"helloworld");
   res.send(newuser);
 })
 
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);
 
 
 

 
app.listen(3000, () => {
  console.log("server is listening to port 3000");
});