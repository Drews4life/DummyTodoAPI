//const MongoClient = require("mongodb").MongoClient;
//deconstructor
const {MongoClient, ObjectID} = require("mongodb");

//var obj = new ObjectID();

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {

    if(err){
       return console.log("MongoDB connection failed");
    }

    console.log("Connected to MongoDB server");

    // db.collection("Todos").insertOne({
    //     text: "Write a line",
    //     completed: false
    // }, (err, res) => {
    //     if(err){
    //         return console.log("Couldnt write data inside mongo", err);
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // db.collection("Users").insertOne({
    //     name: "Andrews",
    //     age: 22,
    //     location: "New-Jersey"
    // }, (err, res) => {
    //     if(err) {
    //         return console.log("Failed to write in DB", err);

    //     }

    //     console.log(res.ops[0]._id.getTimestamp());
    // });

    db.close();
});

