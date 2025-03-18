var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.loggedIn) {
    // Assuming user_type_id is stored in the session (e.g., req.session.user_type_id)
    const userType = req.session.user_type_id;
    console.log("user_type_id :" ,userType);
    if (userType === 1) {
      res.redirect("/customer");
    } else if (userType === 2) {
      res.redirect("/employee");
    } else if (userType === 3) {
      res.redirect("/admin");
    } else {
      // Handle any unexpected user_type_id values
      res.redirect("/loginuser");
    }
  } else {
    res.redirect("/loginuser");
  }
  
  
});

router.get('/logout',function(req,res){
    req.session.destroy(function(err){
      if(err){
        throw err;
      }
      res.redirect('/');
    });
});

module.exports = router;
