
const {MongoClient, ObjectID} = require("mongodb");



MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {

    if(err){
       return console.log("MongoDB connection failed");
    }

    console.log("Connected to MongoDB server");

    // db.collection("Todos").find({
    //     _id: new ObjectID("5adde2b1a404a39f31344c71")

    // }).toArray().then((docs) => {
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     if(err){
    //         console.log("Unable to fetch data", err);
    //     }
    // });

    // db.collection("Todos").find().count().then((count) => {
    //     console.log(`Todos : ${count}`);
    // }, (err) => {
    //     if(err){
    //         console.log("Unable to fetch data", err);
    //     }
    // });
 

    // db.close();

    db.collection("Users").find({name: "Andrews"}).count().then((count) => {
        console.log(`Users Andrew : ${count}`);
    }, (err) => {
        if(err){
            console.log("Unable to fetch data", err);
        }
    });
 

    db.close();
});

