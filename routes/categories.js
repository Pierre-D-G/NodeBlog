var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/new', function (req, res, next) {
    res.render('newCategory');

});


router.post('/new', function (req, res, next) {
    /* Grabbing form data */
    var categoryName = req.body.categoryName;
    // Form validation
    req.checkBody('categoryName', 'Please add a category').notEmpty();

    // Form Validation error handling
    var errors = req.validationErrors();
    if (errors) {
        res.render('newCategory', {
            "errors": errors,
            "categoryName": categoryName,
        });
    } else {
        var categories = db.get('categories');
        // Submitting data to database
        categories.insert({
            "categoryName": categoryName,
            // function (err, category) {
            //     if (err) {
            //         res.render('error')
            //     } else {
            //         console.log(req.flash);
            //         console.log('success');
            //         consoel.log(success);
            //         console.log('messages');
            //         console.log(messages);
            //         req.flash('success', 'Category Added Successfully!');
            //         res.redirect('/');
            //     }
            // }
        });
                    req.flash('success', 'Category Added Successfully!');
                    res.redirect('/');
    }
});

router.get('/show/:category', function(req, res, next){
    var db = req.db;
    var posts = db.get('posts');
    posts.find({category: req.params.category}, {}, function(err, posts){
        res.render('index', {
            "posts": posts
        });
    });
});

module.exports = router;