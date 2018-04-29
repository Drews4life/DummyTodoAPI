const jwt = require("jsonwebtoken");
const {ObjectID} = require("mongodb");
const {Todo} = require("./../../models/todo.js");
const {User} = require("./../../models/user.js");

const firstUserID = new ObjectID();
const secondUserID = new ObjectID();

const users = [{
    _id: firstUserID,
    email: "drewsemailGOOD@gmail.com",
    password: "onewaypass",
    tokens: [{
        access: "auth",
        token: jwt.sign({_id: firstUserID, access: "auth"}, "abc123").toString()
    }]
}, {
    _id: secondUserID,
    email: "drewsemailBAD@gmail.com",
    password: "stillonewaypass"
}];

const todos = [
    {
        _id: new ObjectID(),
        text: "first"
    }, 
    {
        _id: new ObjectID(),
        text: "second",
        completed: true,
        completedAt: 1241235
    }, 
    {
        _id: new ObjectID(),
        text:"third"
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers}
