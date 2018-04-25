var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 25,
        trim: true
    }
});

var User = mongoose.model("User", UserSchema);

var newUser = new User({
    email: "jcolegang@bmail.us"
});

newUser.save().then((res) => {
    console.log("Saved user: \n", JSON.stringify(res, undefined, 2));
}, (err) => {
    if(err){
        console.log(`An error occured ${err}`);
    }
});