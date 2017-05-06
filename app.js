var express = require('express');
path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  ExpressValidator = require('express-validator'),
  mongo = require('mongodb'),
  db = require('monk')('localhost/nodeblog'),
  multer = require('multer'),
  path = require('path');
  flash = require('connect-flash'),
  moment = require('moment'),
  exphbs = require('express-handlebars');


var index = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');

var app = express();

// view engine setup
var hbs = exphbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "views/layouts/"),
  defaultLayout: 'layout.hbs',
  helpers: {
    truncate: function (passString) {
      var theString = passString.substring(0, 400);
      return theString + '...';
    },
    formatDate: function (datetime, format) {
      var DateFormats = {
        long: "dddd DD MMMM YYYY"
      };
      if (moment) {
        format = DateFormats[format] || format;
        return moment(datetime).format(format);
      } else {
        return datetime; 
      }
    }
  }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Express Validator middleware
app.use(ExpressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle express sessions

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Flash Messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Make the database accessable to the router
app.use(function (req, res, next) {
  req.db = db;
  next()
});


app.use('/', index);
app.use('/posts', posts);
app.use('/categories', categories);

// helpers


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;