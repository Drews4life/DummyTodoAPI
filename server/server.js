const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var Todo = mongoose.model("Todo",{
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});


var newTodo = new Todo({
    text: "Buy a car",
    completed: false,
    completedAt: 0000
});

newTodo.save().then((res) => {
    console.log("Saved todo: ", res);
}, (err) => {
    if(err){
        console.log(`an ${err} occured`);
    }
});