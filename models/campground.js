const mongoose = require("mongoose");
const validator = require('validator');

const campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   reviewScore: {
      type: 'Number',
      validate(value) {
         if (value > 5) {
            throw new Error('Review score needs to be less than 5');
         }
      },
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
