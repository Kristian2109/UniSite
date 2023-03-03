const Admin = require("../model/database").adminModel;
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

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
                return done(null, admin);
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


async function RegisterAdmin(req, res) {
    const { email, password, passwordSecond, firstName, lastName, token, idNumber } = req.body;

    if (password !== passwordSecond) {
        return res.redirect("/register");
    }

    try {
        const admin = new Admin({
            username: email,
            fName: firstName,
            lName: lastName,
            token,
            idNumber
        });

        Admin.register(admin, password, (err, user) => {
            console.log(user);
            if (err) {
                console.log(err.message);
                return res.redirect("/");
            }
            else {
                passport.authenticate("local")(req, res, () => {
                    console.log("User authenticated!");
                    return res.redirect("/students");
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.redirect("/register");
    }
}

async function LoginAdmin(req, res) {
    try {
        const admin = new Admin({
            username: req.body.email,
            password: req.body.password
        });
    
        req.logIn(admin, (err) => {
            if (err) {
                console.log(err);
                return res.redirect("/");
            } else {
                passport.authenticate("local")(req, res, () => {
                    return res.redirect("/students");
                });
            }
        })
    } catch (error) {
        console.log(error);
        return res.redirect("/login");
    }
}

function RenderLogInPage(req, res) {
    try {
        if (!req.isAuthenticated()) { return res.render("login") };
        return res.redirect("/students");

    } catch (err) {
        console.log(err.message);
        return res.redirect("/");
    }
}

function LogOutAdmin(req, res) {
    req.logOut((err) => {
        if (err) {
            console.log(err.message);
        }
        return res.redirect("/");
    });
}

module.exports = {
    RegisterAdmin,
    LoginAdmin,
    RenderLogInPage,
    LogOutAdmin
}
