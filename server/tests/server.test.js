const request = require("supertest");
const expect = require("expect");

var {Todo} = require("./../models/todo.js");
//going one folder back
var {app} = require("./../server.js");

const todos = [{text: "first"}, {text: "second"}, {text:"third"}];

//always calls first and clears the database
beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos)
    }).then(() => done());
});

describe("POST /todos", () => {
    it("Should create a new TODO", (done) => {
        var text = "Testing todo text";

        request(app)
            .post("/todos")
            .send({text})
            //custom expect
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err + "\n*Error in callback*");
                }
                
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e + "\n*Error in promise*"));
                
            });
    });


    it("Shouldnt create a new TODO due to invalid input", (done) => {
        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err +  "\n*Error in callback*");
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => done(e + "\n*Error in promise"));
            });
    });
})


describe("GET /todos", () => {

    it("Should succesfully return TODOs", (done) => {

        request(app)
        .get("/todos")
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(3);
        })
        .end(done);

    });
    

});