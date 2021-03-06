const request = require("supertest");
const expect = require("expect");
const {ObjectID} = require("mongodb");

var {Todo} = require("./../models/todo.js");
var {User} = require("./../models/user.js");

//going one folder back
var {app} = require("./../server.js");
var {todos, populateTodos, users, populateUsers} = require("./seed/seed.js");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("POST /todos", () => {
    it("Should create a new TODO", (done) => {
        var text = "Testing todo text";

        request(app)
            .post("/todos")
            .set("x-auth", users[0].tokens[0].token)
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
            .set("x-auth", users[0].tokens[0].token)
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
        .set("x-auth", users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBeGreaterThan(0);
        })
        .end(done);

    });
    

});

describe("GET /todos/:id", () => {

    it("Should return ToDo doc",(done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
                
    });

    it("Should not return ToDo doc created by other user",(done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
                
    });


    it("Should return 404 if ToDo not found", (done) => {

        var hexID = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexID}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("Should return 404 if ID is incorrect", (done) => {
        request(app)
            .get("/todos/12345")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

describe("DELETE /todos/:id", () => {
    it("Should not pass in invalid ID", (done) => {
        request(app)
            .delete("/todos/2312")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it("Should return deleted todo", (done) => {
        var id = todos[0]._id.toHexString();
        
        request(app)
            .delete(`/todos/${id}`)
            .set("x-auth", users[0].tokens[0].token)
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

    it("Shouldnt delete others user todo", (done) => {
        var id = todos[1]._id.toHexString();
        
        request(app)
            .delete(`/todos/${id}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err)
                {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos).toExist();
                    done();
                }).catch((e) => done("Error in promise: " + e));

            });
    });
    
    it("Should validate id, but do not find user to delete", (done) => {
        var id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
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
            .set("x-auth", users[1].tokens[0].token)
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
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeTruthy;
                expect(res.body.todo.completedAt).toBeA("number");
            })
            .end(done);
    });

    it("Shouldnt update todo as second user", (done) => {
        var id = todos[0]._id.toHexString();
        var text = "Testing text update";

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text,
                completed: true
            })
            .set("x-auth", users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});


describe(("GET /users/me"), () => {
    it("Should return the user if authentificated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it("Should return 401, if user is not authentificated", (done) => {
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
}); 

describe("POST /users", () => {
    it("Should create a new user (if email not in use)", (done) => {
        var email = "smthvalid@gm.com";
        var password = "g59werundis";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    return done(err + "***in callback***");
                }

                User.findOne({email}).then((user) => {    
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });    

    it("Should return validation error if email/password are incorrect", (done) => {
        var email = "weqesdadasdsa";
        var password = ":)";

        request(app)
            .post("/users")
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it("Shouldnt create a new user, if email is in use", (done) => {
       var email = "drewsemailGOOD@gmail.com";
       var password = "onewaypass";

       request(app)
            .post("/users")
            .send({email, password})
            .expect(400)
            .end(done);
    });
});

describe("POST /users/login", () => {
    it("Should log in user and return auth token", (done) => {
        var email = users[1].email;
        var password = users[1].password;

        request(app)
            .post("/users/login")
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {

                    expect(user.tokens[0]).toInclude({
                        access: "auth",
                        token: res.headers["x-auth"]
                    });

                    done();
                }).catch((e) => done(e));
            });
                 
    });

    it("Should reject log in with invalid data", (done) => {
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: "sdadsadasd"
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers["x-auth"]).toNotExist();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email: users[1].email}).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe("DELETE /users/me/token", () => {
    it("Should delete token property", (done) => {
        
        request(app)
            .delete("/users/me/token")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findById(users[0]._id).then((res) => {
                    expect(res.tokens[0]).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });
});