var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var identify = require('./identify');
var index = require('./routes/index');
var test = require('./routes/test');
//session set
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var identityKey = 'skey';


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images','bigwhite.jpg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/tmp',express.static(path.join(__dirname,'tmp')));
app.use(session({
		name: identityKey,
		secret: 'Gerid',
		store: new MongoStore({url:'mongodb://localhost/test-app'}),
		saveUninitialized: false,
		resave: false,
	})
	
);
app.use('/',identify,index);
app.use('/test', test);

// catch 404 and forward to error handler
  
app.listen(3000,function(){
	console.log('running');
});
module.exports = app;
