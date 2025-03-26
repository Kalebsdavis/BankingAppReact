var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const pool = require('./lib/sessionPool'); 
require('dotenv').config({ path: './dev.env' });

var indexRouter = require('./routes/index');
var loginuserRouter = require('./routes/loginuser');
var adminselectRouter = require('./routes/adminselect');
var customerRouter = require('./routes/customer');
var employeeRouter = require('./routes/employee');
var registerRouter = require('./routes/register');
var employeeaccountviewRouter = require('./routes/employeeaccountview');
var savingstransactionsRouter = require('./routes/savingstransaction');
var checkingtransactionsRouter = require('./routes/checkingtransaction');
var ATMinterfaceRouter = require('./routes/ATMinterface');
var accountinfoFORCUST =  require('./routes/accountinfoFORCUST');
var money2otheraccountsRouter = require('./routes/money2otheraccounts');
var transferRouter = require("./routes/transfer");
var register_confirmedRouter = require("./routes/register_confirmed");
var authRouter = require('./apiroutes/auth');
var containersRouter = require('./apiroutes/containers');
var transactionsRouter = require('./apiroutes/transactions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'node_modules/bootstrap/dist/')));
app.use(express.static(path.join(__dirname,'node_modules/bootstrap-icons/')));
app.use(express.static(path.join(__dirname,'node_modules/crypto-js/')));

//trigger for database
var dbCon = require('./lib/database');
//session management to store cookies in a mysql server (this has a bug so we assist it by creating the database for it)
var dbSessionPool = require('./lib/sessionPool');
var sessionStore = new MySQLStore({}, dbSessionPool);
// Necessary middleware to store session cookies in MySQL
app.use(session({
  key:'session_cookie_name',
  secret: 'session_cookie_secret1234',
  store: sessionStore,
  resave: false,
  cookie : {
    sameSite: 'strict'
  }
}));
//middleware to make session variables available in .ejs template files
app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/loginuser', loginuserRouter);
app.use('/adminselect', adminselectRouter);
app.use('/customer', customerRouter);
app.use('/employee', employeeRouter);
app.use('/register', registerRouter);
app.use('/accountinfo', require('./routes/accountinfo'));
app.use('/employeeaccountview', employeeaccountviewRouter);
app.use('/savingstransaction', savingstransactionsRouter);
app.use('/checkingtransaction', checkingtransactionsRouter);
app.use('/ATMinterface', ATMinterfaceRouter);
app.use('/accountinfoFORCUST',accountinfoFORCUST);
app.use('/money2otheraccounts', money2otheraccountsRouter);
app.use('/register_confirmed', register_confirmedRouter);
app.use('/api/auth', authRouter);
app.use('/api/containers', containersRouter);
app.use('/api/transactions', transactionsRouter)



app.use('/transfer', transferRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
