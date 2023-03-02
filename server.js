require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const database = require("./model/database");

const ArticlesController = require("./controllers/articles.controller");
const AdminsController = require("./controllers/admins.controller");
const StudentsController = require("./controllers/students.controller");

const app = express();

// --------------------- Middleware --------------------- \\

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

const Admin = database.adminModel;

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (username, password, done) => {
    try {
        const admin = await Admin.findOne({email: username});
        if (!admin) { return done(null, false); }
        admin.authenticate(password, (err, thisModel, passwordErr) => {
            if (passwordErr) {
                console.log(err.message);
                return done(err);
            }
            if (thisModel) {
                done(null, admin);
            }
        })
    } catch (err) {
        console.log(err.message);
        return done(err);
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, user) {
        done(err, user);
    });
});

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

app.listen(process.env.PORT, () => {
    console.log("Server is listening!");
});