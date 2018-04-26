const {ObjectID} = require("mongodb");
const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");

var id = "5ae1e19520808842de8a211e";

if(ObjectID.isValid(id)){
    User.findById(id).then((res) => {
        
        console.log("User: ", res);
        
    }).catch((e) => console.log(e));
} else {
   console.log("ID is not valid");
}

// Todo.findById(id).then((todo) => {

//     if(!todo){
//         return console.log("ID not found");
//     }
//     console.log(`Todo: `,todo);
// }).catch((e) => console.log(e));