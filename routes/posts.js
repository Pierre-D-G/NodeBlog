var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var multer = require('multer');

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
      function (err, post) {
        if (err) {
          res.render('error')
        } else {
          // req.flash('success', 'Blog Post Submitted Successfully!');
          res.redirect('/');
        }
      }
    });
  }
});

module.exports = router;