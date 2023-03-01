require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("passport-local");
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
    secret: "My little secret.",
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session());

const Admin = database.adminModel;

passport.use(Admin.createStrategy());

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

app.post("/register", (req, res) => {
    const { email, password, passwordSecond, firstName, lastName, token, idNumber } = req.body;

    if (password !== passwordSecond) {
        res.redirect("/register");
    }
        // const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
        username: idNumber,
        email,
        fName: firstName,
        lName: lastName,
        token,
        idNumber
    });

    //await Admin.register(admin, password).then((err, user) => {})
    Admin.register(admin, password, (err, user) => {
        console.log(user);
        if (err) {
            console.log(err.message);
        }
        else {
            passport.authenticate("local", (error, user, info) => {
                console.log(error);
                console.log(user);
                console.log(info);
          
                if (error) {
                  res.status(401).send(error);
                } else if (!user) {
                  res.status(401).send(info);
                } else {
                  next();
                }
          
                res.status(401).send(info)
            })(req, res, () => {
                console.log("User authenticated!");
                res.redirect("/students");
            });
        }
    });
});

app.get("/register", (req, res) => { res.render("register"); });
app.post("/login", (req, res) => {
    const admin = new Admin({
        username: req.body.username,
        password: req.body.password
    });

    req.logIn(admin, (err) => {
        console.log(req.isAuthenticated());
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            passport.authenticate("local", (error, user, info) => {
                console.log(info);
                if (error) {
                    console.log(error);
                    console.log(user);
                    console.log(info);
              
                    if (error) {
                      res.status(401).send(error);
                    } else if (!user) {
                      res.status(401).send(info);
                    } else {
                      next();
                    }
                }
            })(req, res, () => {
                res.redirect("/students");
            });
        }
    })
});
app.get("/login", (req, res) => { res.render("login") });

// --------------------- Students --------------------- \\

app.get("/students", StudentsController.FindStudents);
app.get("/students/:id", StudentsController.FindOneStudent);

app.listen(process.env.PORT, () => {
    console.log("Server is listening!");
});