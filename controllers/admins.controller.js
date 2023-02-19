const Admin = require("../model/database").adminModel;
const bcrypt = require("bcrypt");

function RegisterAdmin(req, res) {
    const body = req.body;
    const firstPass = body.password;
    const secondPass = body.passwordSecond;

    if (firstPass === secondPass) {
        bcrypt.hash(firstPass, 10, (err, hashedPass) => {
            if (err) {
                console.log(err.message);
                res.redirect("/register");
            } else {
                const newAdmin = new Admin({
                    email: body.email,
                    password: hashedPass,
                    fName: body.firstName,
                    lName: body.lastName,
                    token: body.token,
                    idNumber: body.idNumber
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
}

function LoginAdmin(req, res) {
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
                    res.redirect("/students");
                } else {
                    res.redirect("/login");
                }
            });
        }
    });
}

module.exports = {
    RegisterAdmin,
    LoginAdmin
}