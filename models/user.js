const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  username: {
    type: 'String',
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }

    },
  },
  password: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
