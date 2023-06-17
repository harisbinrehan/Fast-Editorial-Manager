const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authorRouter = require("./routes/author");
var editorRouter = require("./routes/editor");
var reviewerRouter = require("./routes/reviewer");
var notificationRouter = require("./routes/notifications");
var plagrouter = require("./routes/plagCheck");

var app = express();

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/author", authorRouter);
app.use("/editor", editorRouter);
app.use("/reviewer", reviewerRouter);
app.use("/notifications", notificationRouter);
app.use("/copyleaks", plagrouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  console.log("URL NOT FOUND");
});
app.use(globalErrorHandler);

module.exports = app;
