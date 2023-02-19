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

const users = [
    {
        fName: "First 1",
        lName: "Last 1",
        email: "user1@gmail.com",
        group: 6
    },
    {
        fName: "First 2",
        lName: "Last 2",
        email: "user2@gmail.com",
        group: 6
    },
    {
        fName: "First 2",
        lName: "Last 2",
        email: "user2@gmail.com",
        group: 6
    },
    {
        fName: "First 3",
        lName: "Last 3",
        email: "user3@gmail.com",
        group: 6
    },
    {
        fName: "First 4",
        lName: "Last 4",
        email: "user4@gmail.com",
        group: 6
    }
]

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const database = require("./model/database");
const Student = database.studentModel;

const ArticlesController = require("./controllers/articles.controller");
const AdminsController = require("./controllers/admins.controller");
const StudentsController = require("./controllers/students.controller");

// news.forEach((user) => {
//     const newUser = new News(user);
//     newUser.save(err => {
//         if (err) console.log(err);
//     });
// });

const app = express();

// --------------------- Mmiddleware --------------------- \\

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// --------------------- Articles --------------------- \\

app.get("/", ArticlesController.GetArticles);
app.get("/articles/:articleTitle", ArticlesController.GetOneArticle);
app.get("/register", (req, res) => { res.render("register"); });

// --------------------- Admins --------------------- \\

app.post("/register", AdminsController.RegisterAdmin);
app.post("/login", AdminsController.LoginAdmin);
app.get("/login", (req, res) => { res.render("login") });

// --------------------- Students --------------------- \\

app.get("/students", StudentsController.FindStudents);

app.listen(process.env.PORT, () => {
    console.log("Server is listening!");
});