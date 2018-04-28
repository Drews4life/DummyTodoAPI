const request = require("supertest");
const expect = require("expect");
const {ObjectID} = require("mongodb");

var {Todo} = require("./../models/todo.js");
//going one folder back
var {app} = require("./../server.js");

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
                expect(res.body.result.text).toBe(text);
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

describe("GET /todos/:id", () => {

    it("Should return ToDo doc",(done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(todos[0].text);
            })
            .end(done);
                
    });


    it("Should return 400 if ToDo not found", (done) => {

        var hexID = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexID}`)
            .expect(400)
            .end(done);
    });

    it("Should return 400 if ID is incorrect", (done) => {
        request(app)
            .get("/todos/12345")
            .expect(400)
            .end(done);
    });

});

describe("DELETE /todos/:id", () => {
    it("Should not pass in invalid ID", (done) => {
        request(app)
            .delete("/todos/2312")
            .expect(400)
            .end(done);
    });

    it("Should return deleted todo", (done) => {
        var id = todos[0]._id;
        
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo._id).toBe((todos[0]._id).toHexString());
            })
            .end((err, res) => {
                if(err)
                {
                    return done(err);
                }

                Todo.find().then((docs) => {
                    expect(docs.length).toBe(2);
                    Todo.findById(id)
                }).then((todos) => {
                    expect(todos).toNotExist();
                    done();
                }).catch((e) => done("Error in promise: " + e));

            });
    });
    
    it("Should validate id, but do not find user to delete", (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(400)
            .end(done);
    });
});

describe("PATCH /todos/:id", () => {
    it("Should change completedAt if completed === false", (done) => {
        var id = todos[1]._id.toHexString();
        var text = "hello from test";

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeFalsy;
                expect(res.body.todo.completedAt).toNotExist;

            })
            .end(done);
    });


    it("Should update todo", (done) => {
        var id = todos[0]._id.toHexString();
        var text = "Testing text update";

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeTruthy;
                expect(res.body.todo.completedAt).toBeA("number");
            })
            .end(done);
    });
});