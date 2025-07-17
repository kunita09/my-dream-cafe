require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var app = express();

mongoose.Promise = global.Promise;

// เชื่อม MongoDB โดยใช้ค่าใน .env
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const allTotal = require('./routes/allTotal');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', allTotal);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});


module.exports = app;
