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
  //technically we do not even use username and password in this model because passport automatically will create an object with username, salt, hash (password).
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
