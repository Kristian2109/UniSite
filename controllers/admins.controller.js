const Admin = require("../model/database").adminModel;
const bcrypt = require("bcrypt");

async function RegisterAdmin(req, res) {
    const { email, password, passwordSecond, firstName, lastName, token, idNumber } = req.body;

    if (password !== passwordSecond) {
        return res.redirect("/register");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({
            email,
            password: hashedPassword,
            fName: firstName,
            lName: lastName,
            token,
            idNumber
        });

        await admin.save();

        res.redirect("/students");
    } catch (error) {
        console.error(error);
        res.redirect("/register");
    }
}

async function LoginAdmin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await Admin.findOne({ email });

        if (!user) {
            return res.redirect("/login");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            return res.redirect("/students");
        } else {
            return res.redirect("/login");
        }
    } catch (error) {
        console.error(error);
        res.redirect("/login");
    }
}

module.exports = {
    RegisterAdmin,
    LoginAdmin
}
