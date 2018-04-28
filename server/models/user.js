const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  });

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ["email", "_id"]);
};



UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  
    user.tokens.unshift({access, token});
  
    return user.save().then(() => {
    return token;
    });
};


var User = mongoose.model("User", UserSchema);

// var newUser = new User({
//     email: "jcolegang@bmail.us"
// });

// newUser.save().then((res) => {
//     console.log("Saved user: \n", JSON.stringify(res, undefined, 2));
// }, (err) => {
//     if(err){
//         console.log(`An error occured ${err}`);
//     }
// });

module.exports = {User};