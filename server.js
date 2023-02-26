require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const ArticlesController = require("./controllers/articles.controller");
const AdminsController = require("./controllers/admins.controller");
const StudentsController = require("./controllers/students.controller");

const app = express();

// --------------------- Middleware --------------------- \\

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