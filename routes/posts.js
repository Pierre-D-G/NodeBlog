var express = require('express');
var router = express.Router();
var mongo = require('mongodb')
var db = require('monk')('localhost/nodeblog')

/* Posts router */

/* Create a new blog post route*/
router.get('/new', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
