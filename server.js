require("dotenv").config();

const fs = require("fs");
const https = require("https");
const multer = require("multer");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
//const helmet = require("helmet");

const ArticlesController = require("./controllers/articles.controller");
const AdminsController = require("./controllers/admins.controller");
const StudentsController = require("./controllers/students.controller");

const PORT = process.env.PORT;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.idNumber + file.originalname);
    }
});

const upload = multer({storage: storage});
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

app.get("/students", StudentsController.RenderStudentsPage);
app.get("/students/:id", StudentsController.RenderSigleStudentPage);

app.post("/modifyStudent", StudentsController.ModifyStudent);

app.get("/createStudent", StudentsController.RenderCreateStudentPage);
app.post("/createStudent", upload.single("studentPhoto"), StudentsController.CreateStudent)

// https.createServer({
//     key: fs.readFileSync("key.pem"),
//     cert: fs.readFileSync("cert.pem")
// }, app).listen(PORT, () => {
//     console.log(`Server is listening on port ${PORT}!`);
// });
app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}!`);
});