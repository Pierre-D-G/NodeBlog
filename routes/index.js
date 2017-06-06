var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var posts = db.get('posts');
var categories = db.get('categories');
var login = db.get('login');

// Blog Home Page
router.get('/', function (req, res, next) {
  posts.find({}, {}, function (err, posts) {
    res.render('index', {
      "posts": posts,
    });
  });
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
);

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


module.exports = router;