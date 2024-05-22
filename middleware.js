const Listing = require("./models/listing");
const Review= require("./models/review");
const ExpressError = require("./utils/expressError.js");
const { listingSchema ,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
     
    if(!req.isAuthenticated())
    {
      req.session.redirectUrl=req.originalUrl;
      req.flash("error","you must be logged into create listing");
      return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner= async(req,res,next)=>{
     
  let { id } = req.params;
  let listing= await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id))
  {
    req.flash("error","you don't have permission to edit")
     return res.redirect( `/listings/${id}`)
  }
  next();
}
module.exports.validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);

  
   if(error)
   {
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(450,errmsg);
   }
   else{
    next();
   }
};
module.exports.validateReviews=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body.review);
  
   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
   }
   else{
    next();
   }
};
module.exports.isReviewauthor= async(req,res,next)=>{
     
  let {id,reviewId} = req.params;
  let review= await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id))
  {
    req.flash("error","you arebnot the author of this review")
     return res.redirect( `/listings/${id}`)
  }
  next();
}