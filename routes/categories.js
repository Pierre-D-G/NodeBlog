var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

var posts = db.get('posts');
var categories = db.get('categories');
var login = db.get('login');

router.get('/new', isLoggedIn, function (req, res, next) {
    res.render('newCategory');
});


router.post('/new', isLoggedIn, function (req, res, next) {
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
        // Submitting data to database
        categories.insert({
            "categoryName": categoryName,
        });
        req.flash('success', 'Category Added Successfully!');
        res.redirect('/');
    }
});

router.get('/show/:category', function (req, res, next) {
    posts.find({
        category: req.params.category
    }, {}, function (err, posts) {
        res.render('index', {
            "posts": posts
        });
    });
});

module.exports = router;

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/')
}