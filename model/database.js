require("dotenv").config();

const mongoose = require("mongoose");
const mongooseLocal = require("passport-local-mongoose");

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1/studentInformationDB", (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Database connected");
    }
});



// ------------------ Admin ------------------

const adminSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    password: String,
    idNumber: String,
    token: String
});
const Admin = mongoose.model("Admin", adminSchema);


// ------------------ News ------------------

const imageSchema = new mongoose.Schema({
    title: String,
    relativePath: String
});

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
    images: [imageSchema]
});

const News = mongoose.model("New", newsSchema);

// ------------------ Students ------------------

const disciplineSchema = new mongoose.Schema({
    name: String,
    grades: [Number],
    avgGradeDisc: Number
});

const studentsSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    idNumber: String,
    photoPath: String,
    group: {
        type: Number,
        max: 10,
        min: 1
    },
    specialty: String,
    disciplines: [disciplineSchema],
    avgGrade: Number
});

const Student = mongoose.model("Student", studentsSchema);

module.exports = {
    newsModel: News,
    adminModel: Admin,
    studentModel: Student
}