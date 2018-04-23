
const {MongoClient, ObjectID} = require("mongodb");



MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {

    if(err){
       return console.log("MongoDB connection failed");
    }

    console.log("Connected to MongoDB server");

    // db.collection("Todos").deleteMany({completed: false}).then((res) => {
    //     console.log(res.result);
    // }, (err) => {
    //     if(err) {
    //         console.log(`Couldnt delete records, encountered ${err}`)
    //     }
    // });
    

    // db.collection("Todos").deleteOne({completed: true}).then((res) => {
    //     console.log(res.result);
    // });

    // db.collection("Todos").findOneAndDelete({completed: true}).then((res) => {
    //     console.log(res);
    // }, (err) => {
    //     if(err){
    //         console.log(`${err} occured`);
    //     }
    // });

    db.collection("Users").deleteMany({name: "Andrews"}).then((res) => {
        console.log(`All Andrews are deleted : ${res.result}`);
    }, (err) => {
        if(err){
            console.log(`${err} occured`);
        }
    });

    db.collection("Users").findOneAndDelete({
        _id: new ObjectID("5adddd36f40979237c3cc3cb")
    }).then((res) => {
        console.log(`Succesfully deleted : ${res}`);
    }, (err) => {
        if(err){
            console.log(`${err} occured`);
        }
    });

    db.close();
});

