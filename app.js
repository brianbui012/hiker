//Set Up for App
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  Campground = require(__dirname + "/models/campground"),
  Comment = require("./models/comment");

//Router Require // Routes Use is near the bottom
const campgroundRoutes = require('./routes/campgrounds'),
  commentRoutes = require('./routes/comments'),
  authRoutes = require('./routes/index');


mongoose.connect("mongodb://localhost:27017/hiker", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION

app.use(require("express-session")({
  secret: "This is my secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This is a middle ware to run before all our routes (you can tell by next();)
app.use((req, res, next) => {
  //whatever is inside res.locals is availiable in all our templates (kind of like a global variable?)
  res.locals.currentUser = req.user;
  next();
});


app.use(authRoutes);

app.use("/campgrounds", campgroundRoutes);
//changing comments like this will cause an error in req.params.id. Our :id param is not making it through to our comment routes
//look in route/comments.js {mergeParams:true} in the expressRouter which merges the params of the campgrounds and the comments
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("The server is working!");
});
