const news = [
    {
        title: "News 1",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        title: "News 2",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        title: "News 3",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        title: "News 2",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        title: "News 3",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
]

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const database = require("./model/database");
const News = database.newsModel;
const Admin = database.adminModel;

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    News.find({}, (err, items) => {
        if (err) {
            console.log(err.message);
        }
        else if (items.length === 0) {
            res.render("home", {news: news});
        } else {
            res.render("home", {news: items});
        }
    });
});

app.get("/articles/:articleTitle", (req, res) => {
    const articleTitle = _.capitalize(req.params.articleTitle);
    News.findOne({title: articleTitle}, (err, result) => {
        if (err) {
            console.log(err.message);
            res.redirect("/");
        } else if (result) {
            res.render("article", {article: result});
        } else {
            res.render("article", {article: {
                title: "This article doesn't exsists",
                content: "Please go to the home page"
                }
            });
        }
    });
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const body = req.body;
    const email = body.email;
    const rawPassword = body.password;
    const firstName = body.firstName;
    const lastName = body.lastName;
    const token = body.token;
    const id = body.idNumber;
    const secondPass = body.passwordSecond;
    if (rawPassword === secondPass) {
        bcrypt.hash(rawPassword, 10, (err, hashedPass) => {
            if (err) {
                console.log(err.message);
                res.redirect("/register");
            } else {
                const newAdmin = new Admin({
                    email: email,
                    password: hashedPass,
                    fName: firstName,
                    lName: lastName,
                    token: token,
                    idNumber: id
                });
                newAdmin.save(err => {
                    if (err) {
                        console.log(err.message);
                    } else {
                        res.redirect("/students");
                    }
                })
            }
        });
    } else {
        res.redirect("/register")
    }
    
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Admin.findOne({email: email}, (err, user) => {
        if (err) console.log(err.message)
        else if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect("/login");
                } 
                else if (result) {
                    res.render("students");
                } else {
                    res.redirect("/login");
                }
            });
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log("Server is listening!");
});