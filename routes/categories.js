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
            function (err, category) {
                if (err) {
                    res.render('error')
                } else {
                    req.flash('success', 'Category Added Successfully!');
                    res.redirect('/');
                }
            }
        });
    }
});

module.exports = router;