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
    username: String,
    password: String,
    idNumber: String,
    token: String
});

adminSchema.plugin(mongooseLocal);

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

// ------------------ Major Schema ------------------ \\

const majorSchema = new mongoose.Schema({
    name: String,
    subjects: [String],
});

const majorModel = mongoose.model("Major", majorSchema);

const majors = {
    Informatics: ["Programming", "Math", "Algebra", "Discrete math", "Algorithms", "Introduction to programming", "OOP", "Operational systems", "English"],
    Philosophy: ["Literature", "Social science", "Behaviour", "Influence", "History", "English"],
    Psychology: ["Literature", "Social science", "Behaviour", "Influence", "History", "English", "Psychology in business"],
    Medicine: ["Biology", "Anathomy", "Psychology", "Practice disection", "Blood system", "Brain activity", "Emergency"],
    Mathematics: ["Math", "Algebra", "Discrete math", "Algorithms", "Introduction to programmin", "OOP", "Operational systems", "English", "Mathematical strucutures"],
    Engineering: ["Physics", "Mechanics", "Electronics", "Math", "English", "Computing"]
}


if (majorModel.find().length < 5) {
    for (const major in majors) {
        const newMajor = new majorModel({
            name: major,
            subjects: majors[major]
        });
        console.log(majors[major]);
        newMajor.save()
    }
}


// ------------------ Students Schmea ------------------ \\

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
    rank: Number,
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
    Student,
    majorModel
}