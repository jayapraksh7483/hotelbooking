const express=require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const{listingSchema}=require("../schema.js");
const Listing = require("../models/listing");
const{isLoggedIn,isOwner,validateListing}=require("../middleware.js");

 const listingController=require("../controller/listings.js");
 const multer  = require("multer")
 const{storage}=require("../cloudconfig.js");
 const upload=multer({storage});
 


 router
 .route("/")
 .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.Createlisting));
  

  
  //New Route
  router.get("/new", isLoggedIn,listingController.renderNewform);
  
  //Show Route
  router
  .route("/:id")
  .get( wrapAsync(listingController.showlistings))
  .put(isLoggedIn,isOwner,upload.single("listing[image]"), validateListing,   wrapAsync(listingController.updatelisting ))
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.deletelisting  ));
  
  
  
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.editlisting));
   
  module.exports=router;