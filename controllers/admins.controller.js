const Admin = require("../model/database").adminModel;
const bcrypt = require("bcrypt");
const passport = require("passport");


async function RegisterAdmin(req, res) {
    const { email, password, passwordSecond, firstName, lastName, token, idNumber } = req.body;

    if (password !== passwordSecond) {
        return res.redirect("/register");
    }

    try {
        // const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({
            username: email,
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
                return res.redirect("/home");
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
        return res.redirec("/home");
    });
}

module.exports = {
    RegisterAdmin,
    LoginAdmin,
    RenderLogInPage,
    LogOutAdmin
}
