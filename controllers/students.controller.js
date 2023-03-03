const Student = require("../model/database").studentModel;
const CreateStudent = require("../model/testData").CreateRandomStudent;

async function FindStudents(req, res) {
    try {
        const students = await Student.find({});
        const sortedStudents = students.sort((a, b) => b.avgGrade - a.avgGrade);
        res.render("students", {students: sortedStudents});
    } catch (error) {
        console.error(error.message);
        res.redirect("/");
    }
}

async function FindStudentsPage(req, res) {
    try {
        const {page, limit: lenPage} = req.query;
        const instancesToSkip = (page - 1) * lenPage;
        const students = await Student.find({})
                                      .skip(instancesToSkip)
                                      .limit(lenPage);
        
        res.render("students", {students});
    } catch (error) {
        console.error(error.message);
        res.redirect("/");
    }
}

async function FindOneStudent(req, res) {
    try {
        const id = req.params.id;
        const admin = req.user;
        const student = await Student.findById(id);
        res.render("student", {student, admin});
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
}

async function ModifyStudent(req, res) {
    console.log(req.body);
    res.redirect("/students");
}

// function RandomTrueOrFalse() {
//     return Math.floor(Math.random() * 2) == 1;
// }

// const studentList = []
// for (let i = 0; i < 10; i++) {
//     const newStudent = new Student(CreateStudent(RandomTrueOrFalse()));
//     studentList.push(newStudent);
// }

// Student.insertMany(studentList, (err) => {
//     if (err) console.log(err.message);
// });

module.exports = {
    FindStudents,
    FindStudentsPage,
    FindOneStudent,
    ModifyStudent
}