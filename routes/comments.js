const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Comment = require("../models/comment");

//================
//COMMENTS ROUTES
//=================

//Comments New
router.get("/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: foundCampground });
    }
  })
});

//Comments Create
router.post("/", (req, res) => {
  options = { day: '2-digit', month: '2-digit', year: '2-digit' };
  const today = new Date();
  const time = today.toLocaleDateString("en-US", options)

  const text = req.body.comment.text;
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create({ text, time }, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;

          comment.save();
          foundCampground.comments.push(comment);
          foundCampground.save();
          res.redirect("/campgrounds/" + req.params.id);
        }
      });
    }
  });
});

//Comment Edit
router.get("/:comment_id/edit", (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.render("back");
    } else {
      res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
    }
  });
});

//COMMENT UPDATE ROUTE

router.put("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })

});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        res.redirect("back");
      } else {
        //does the user own the campground?
        if (foundComment.author.id.equals(req.user._id)) {
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
