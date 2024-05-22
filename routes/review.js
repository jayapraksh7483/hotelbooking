const express=require("express");
const router = express.Router({ mergeParams:true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/expressError.js");
const review = require("../models/review.js");
const Listing = require("../models/listing.js");
const{ validateReviews, isLoggedIn,isReviewauthor }=require("../middleware.js")
 
const reviewController=require("../controller/reviews.js");

 


//review route
//post
router.post("/",  isLoggedIn ,  wrapAsync(reviewController.reviewpost));
  //delete review route
  router.delete("/:reviewId", isLoggedIn ,isReviewauthor, validateReviews, wrapAsync(reviewController.reviewdelete));
  module.exports=router;