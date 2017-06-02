var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var multer = require('multer');
var path = require('path');

var db = require('monk')('localhost/nodeblog');

/* saving the extention of the file uploaded */

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage
});

/* Posts router */

/* Create a new blog post route*/
router.get('/new', function (req, res, next) {
  var categories = db.get('categories');
  categories.find({}, {}, function (err, categories) {
    res.render('newBlog', {
      "categories": categories
    });
  });
});

/*Post form data*/
router.post('/new', upload.single('blogImage'), function (req, res, next) {
  /* Grabbing form data */
  var title = req.body.title,
    category = req.body.category,
    author = req.body.author,
    content = req.body.content,
    date = new Date();


  /*  Grabbing form image data */
  if (req.file) {
    // var blogImageOgName = req.file.;
    var mainBlogImageName = req.file.filename
  } else {

    var mainBlogImageName = 'noimage.png'
  }
  // Form validation
  req.checkBody('title', 'A blog title is required').notEmpty();
  req.checkBody('category', 'Please add a category for your blog').notEmpty();
  req.checkBody('author', 'An author is required').notEmpty();
  req.checkBody('content', 'You cannot post a blog without content').notEmpty();

  // Form Validation error handling
  var errors = req.validationErrors();
  if (errors) {
    res.render('newBlog', {
      "errors": errors,
      "title": title,
      "content": content
    });
  } else {
    var posts = db.get('posts');

    // Submitting data to database
    posts.insert({
      "title": title,
      "category": category,
      "author": author,
      "content": content,
      "date": date,
      "blogImage": mainBlogImageName,
    });
    req.flash('success', 'Blog Post Submitted Successfully!');
    res.redirect('/');
  }
});

router.get('/show/:id', function (req, res, next) {
  var posts = db.get('posts');
  posts.findOne(req.params.id, function (err, post) {
    res.render('show', {
      "post": post
    });
  });
});

/*Post comments data*/
router.post('/newcomment', function (req, res, next) {
  /* Grabbing form data */
  var commentorName = req.body.commentorName,
    commentorAvatar = req.body.avatar,
    commentBody = req.body.commentBody,
    postId = req.body.postId,
    commentDate = new Date();

  // Form validation
  req.checkBody('commentorName', 'Please enter your name').notEmpty();
  req.checkBody('commentBody', 'You cannot leave a blank comment').notEmpty();

  // Form Validation error handling and entering data into database
  var errors = req.validationErrors();
  if (errors) {
    var posts = db.get('posts');
    posts.findOne(postId, function (err, post) {
      res.render('show', {
        "errors": errors,
        "post": post
      });
    });

  } else {
    var comment = {
      "commentorName": commentorName,
      "commentorAvatar": commentorAvatar,
      "commentBody": commentBody,
      "commentDate": commentDate
    }

    var posts = db.get('posts');

    posts.update({
      "_id": postId
    }, {
      $push: {
        "comments": comment
      },
    });
    req.flash('success', "Your comment has been added successfully!")
    res.location('/posts/show/' + postId);
    res.redirect('/posts/show/' + postId);
  }
});

// Edit Blog Post
router.get('/edit/:id', function (req, res, next) {
  var categories = db.get('categories');
  var posts = db.get('posts');
  posts.findOne(req.params.id, function (err, post) {
    categories.find({}, {}, function (err, category) {
      res.render('edit', {
        "category": category,
        "post": post
      });
    });
  });
});
// Update Blog
router.put("/:id", upload.single('blogImage'), function(req, res, next){
    var updatedPost = {
      "author": req.body.author,
      "title": req.body.title,
      "category": req.body.category,
      "content": req.body.content,
      "date": new Date(),
      "blogImage": req.file.filename
    };
    var posts = db.get('posts');
    posts.findOneAndUpdate(req.params.id, updatedPost, function(editedPost){
        req.flash('success', "Your blog post has been updated succesfully!")
        res.render('/posts/show/' + req.params.id)
    }); 
});
module.exports = router;