var mongoose = require("mongoose");


var TodoSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100,
        //removes all white spaces from string
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});


var Todo = mongoose.model("Todo", TodoSchema);

// var newTodo = new Todo({
//     text: "     Buy a bby boy     ",
   
// });

// newTodo.save().then((res) => {
//     console.log("Saved todo: \n", JSON.stringify(res, undefined, 2));
// }, (err) => {
//     if(err){
//         console.log(`An error occured ${err}`);
//     }
// });

module.exports = {Todo};