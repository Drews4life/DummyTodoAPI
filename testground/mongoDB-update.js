
const {MongoClient, ObjectID} = require("mongodb");



MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {

    if(err){
       return console.log("MongoDB connection failed");
    }

    console.log("Connected to MongoDB server");

    // db.collection("Todos").findOneAndUpdate({
    //     _id: new ObjectID("5addf5eda404a39f313450d5")
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // }).then((res) => {
        
    //     console.log(res);
    // }, {
    //     //third overload that always return true
    //     //we want to return updated record
    //     returnOriginal: false
    // });

    db.collection("Users").findOneAndUpdate({
        _id: new ObjectID("5adddd0b30490c061470be8f")
    }, {
        $set: {
            name: "Andrew",
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    });




    db.close();
});
