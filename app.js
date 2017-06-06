var express = require('express'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  passport = require('passport'),
  localStrategy = require('passport-local').Strategy,
  bodyParser = require('body-parser'),
  ExpressValidator = require('express-validator'),
  mongo = require('mongodb'),
  db = require('monk')('localhost/nodeblog'),
  multer = require('multer'),
  path = require('path'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  moment = require('moment'),
  exphbs = require('express-handlebars');

var posts = db.get('posts');
var categories = db.get('categories');
var login = db.get('login');

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
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({url: 'mongodb://localhost:27017/nodeblog'}),
  cookie: {maxAge: 180 * 60 * 1000}
}));

// Passport

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({
		/* Define custom fields for passport */
		    usernameField : 'email',
        passwordField : 'password'
	}, 
	function(email, password, done) {	
		/* validate email and password */
		login.findOne({email: email}, function(err, user) {
			if (err) { return done(err); }
			if (!user) {
				return done(null, false, {message: 'Incorrect username.'});
			}
			if (user.password != password) {
				return done(null, false, {message: 'Incorrect password.'});
			}
			/* if everything is correct, let's pass our user object to the passport.serializeUser */
			return done(null, user);
		});
	}
));

passport.serializeUser(function(user, done) {
    /* Attach to the session as req.session.passport.user = { email: 'test@test.com' } */
	/* The email key will be later used in our passport.deserializeUser function */
	done(null, user.email);
});

passport.deserializeUser(function(email, done) {
	login.findOne({email: email}, function(err, user) {
		/* The fetched "user" object will be attached to the request object as req.user */
		done(err, user);
	});
});

/* Flash Messages */
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash('success')
  next();
});

/* Make the database accessable to the router */
app.use(function (req, res, next) {
  req.db = db;
  next()
});

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})

app.use(methodOverride("_method"));


/* Routes */
app.use('/', index);
app.use('/posts', posts);
app.use('/categories', categories);



/* catch 404 and forward to error handler */
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* error handler */
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;