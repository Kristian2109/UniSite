require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const https = require("https");
const fs = require("fs");
//const helmet = require("helmet");

const ArticlesController = require("./controllers/articles.controller");
const AdminsController = require("./controllers/admins.controller");
const StudentsController = require("./controllers/students.controller");
const PORT = process.env.PORT;

const app = express();

// --------------------- Middleware --------------------- \\

//app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

// --------------------- Articles --------------------- \\

app.get("/", ArticlesController.GetArticles);
app.get("/articles/:articleTitle", ArticlesController.GetOneArticle);

// --------------------- Admins --------------------- \\

app.get("/register", (req, res) => { res.render("register"); });
app.post("/register", AdminsController.RegisterAdmin);

app.get("/login", AdminsController.RenderLogInPage);
app.post("/login", AdminsController.LoginAdmin);

app.get("/logout", AdminsController.LogOutAdmin)

// --------------------- Students --------------------- \\

app.get("/students", StudentsController.FindStudents);
app.get("/students/:id", StudentsController.FindOneStudent);
app.post("/modifyStudent", StudentsController.ModifyStudent)

https.createServer({
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
}, app).listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
});