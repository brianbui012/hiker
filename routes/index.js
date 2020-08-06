const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");

//Root Route
router.get("/", function (req, res) {
  res.render("login");
});


//=====================
//AUTHORIZATION ROUTES
//====================

//Register Show Page
router.get('/register', (req, res) => {
  res.render("register");
});

//Register Create
router.post('/register', (req, res) => {
  const newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/campgrounds/me");
    })
  })
});

//Show Sign In Page
router.get("/login", (req, res) => {
  res.render("login");
});

//Signing In Logic
router.post('/login', passport.authenticate("local", {
  successRedirect: "/campgrounds/me",
  failureRedirect: "/login",
}), (req, res) => {
  //nothing needed in this callback function, can remove but this is just to use to show that passport authenticate is a middleware
});

//Log Out Logic destroys the session
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/login");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
