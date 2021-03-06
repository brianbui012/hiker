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

const campgroundRoutes = require('./routes/campgrounds'),
  commentRoutes = require('./routes/comments'),
  authRoutes = require('./routes/index');


const connectDB = require('./backend/connection')
connectDB();
// mongoose.connect("mongodb://localhost:27017/hiker", { useNewUrlParser: true, useUnifiedTopology: true });
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

app.use((req, res, next) => {
  //whatever is inside res.locals is availiable in all our templates (kind of like a global variable)
  res.locals.currentUser = req.user;
  next();
});


app.use(authRoutes);

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const port = process.env.PORT || 3000;

app.listen(port, process.env.IP, () => {
  console.log(`Connected to ${port}`);
});
