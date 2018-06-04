var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

//loading mongoose user model
require('../models/user');
var User = mongoose.model('users');

router.get('/login'  , (req,res) => {
  res.render('users/login');
});

// get register form
router.get('/register' , (req,res) => {
  res.render('users/register');
});

//submit registration form and save to db
router.post('/register' , (req,res) => {
  let errors = [] ;
  if(req.body.password != req.body.password2){
    errors.push({'text' : "passwords do not match"});
  }

  if(req.body.password.length<4){
    errors.push({'text' : 'password must be of atleast 4 characters'});
  }

  if(errors.length>0){
    res.render('users/register' , {
      errors : errors,
      name : req.body.name ,
      email : req.body.email ,
      password: req.body.password ,
      password2 : req.body.password2
    });
  }
  else{
    User.findOne({email : req.body.email})
    .then(user => {
      if(user){
        req.flash('error_msg' , "This email is already registered");
        res.redirect('/users/register');
      }
      else{
        const newUser = new  User({
          name : req.body.name ,
          email : req.body.email ,
          password : req.body.password
        }) ;
    
        bcrypt.genSalt(10 , (err,salt) => {
          bcrypt.hash(req.body.password , salt , (err, hash) => {
            if(err) throw err;
            newUser.password=hash ;
            newUser.save()
              .then((user) => {
                req.flash('success_msg' , "User is successfully registered");
                res.redirect('/users/login');
              })
              .catch((err) => {
                console.log(err);
                return ;
              })
          })
        });
      }
    });
    
  }
});

//user login submission
router.post('/login' , (req,res,next) => {
  passport.authenticate('local' , {
    successRedirect : '/ideas' ,
    failureRedirect : '/users/login',
    failureFlash : true  
  })(req,res,next);
  
});

//logout
router.get('/logout' , (req,res) => {
  req.logout();
  req.flash('success_msg' ,'You are successfully logged out');
  res.redirect('login');
});

module.exports = router ;