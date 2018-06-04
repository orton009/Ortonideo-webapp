var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var {ensureAuthenticated} = require('../helpers/auth');

//Load Idea model
require('../models/Idea');
var Idea = mongoose.model('ideas');

router.get('' , ensureAuthenticated ,function(req,res){
    Idea.find({user : req.user.id})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index' , {
                ideas: ideas
            });
        });
});


router.get('/add' , ensureAuthenticated , function(req,res){
    res.render("ideas/add");
});

//validate ideas and then push to db
router.post('/add' , ensureAuthenticated , function(req,res){
    let errors = [] ;
    if(!req.body.title){
        errors.push({ text : "Title is required"});
    }
    if(!req.body.details){
        errors.push({text : "Details are required"});
    }
    if(errors.length>0){
        res.render('ideas/add' , {
            errors: errors ,
            title : req.body.title ,
            details : req.body.details
        });
    }
    else {
        const newUser = {
            title : req.body.title ,
            details : req.body.details ,
            user : req.user.id
        }
        new Idea(newUser)
        .save()
        .then(ideas => {
            req.flash('success_msg' , "Video added successfully");
            res.redirect('/ideas/')
        });
    }
});

//update ideas
router.get('/update/:id' ,ensureAuthenticated , function(req,res){
    Idea.findOne({
       _id : req.params.id
   })
   .then(idea => {
       if(idea.user != req.user.id)
       {
           req.flash('error_msg' , 'Idea not found for this user');
           res.redirect('/ideas');
       }
       else{
        res.render("ideas/update" , {
            idea:idea
           });
       }
       
   });
});
router.put('/:id' , ensureAuthenticated ,function(req,res){
    Idea.findOne({
        _id : req.params.id
    })
    .then( (idea) => {
        //new values
        idea.title = req.body.title ,
        idea.details = req.body.details

        idea.save()
        .then(idea => {
            req.flash('success_msg' , "Video updated successfully");
            res.redirect('/ideas');
        });
    });
});

//deleting ideas
router.delete('/:id' , ensureAuthenticated ,function(req,res){
    Idea.remove({_id : req.params.id})
    .then( () => {
        req.flash('success_msg' , "Video deleted successfully");
        res.redirect('/ideas');
    } );
});

module.exports = router ;