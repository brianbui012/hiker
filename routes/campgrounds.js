const express = require('express');
const router = express.Router();


const Campground = require("../models/campground");
//INDEX
router.get("/", (req, res) => {
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index",
        {
          campgrounds: allCampgrounds,
          title: 'National Hikers',
          path: "/"
        });
    }
  });
});

router.get("/me", isLoggedIn, (req, res) => {
  Campground.find({ "author.username": req.user.username }, function (err, myCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index",
        {
          campgrounds: myCampgrounds,
          title: "National Parks You've Visited",
          path: "/me"
        })
    }
  })
})


//NEW ROUTE
router.get('/new', isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});


//Campground Create
router.post("/", isLoggedIn, (req, res) => {
  const { name, image, description, reviewScore } = req.body;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  const newCampground = { name, image, description, author, reviewScore };
  Campground.create(newCampground, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

//SHOW
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", { campground: foundCampground });
    }
  });
});



//Edit Route
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

router.put('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

router.delete('/:id', (req, res) => {
  Campground.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        res.redirect("back");
      } else {
        //does the user own the campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
};


module.exports = router;
