const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");


const usersSchema= new Schema({
   
    email:{
        type:String,
        required:true,
    },
    
})
usersSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("users",usersSchema)