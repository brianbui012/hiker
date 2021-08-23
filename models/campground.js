const mongoose = require("mongoose");
const validator = require('validator');

const campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   reviewScore: {
      type: 'Number',
      min: [1, 'Your review score must be at least 1'],
      max: [5, 'Your rating cannot be more than 5']
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String,
   }
});

module.exports = mongoose.model("Campground", campgroundSchema);
