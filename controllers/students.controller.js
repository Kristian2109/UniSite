const Student = require("../model/database").studentModel;
const CreateStudent = require("../model/testData").CreateRandomStudent;

function FindStudents(req, res) {
    Student.find({}, (err, students) => {
        res.render("students", {students: students});
    });
}

function RandomTrueOrFalse() {
    return Math.floor(Math.random() * 2) == 1;
}

const studentList = []
for (let i = 0; i < 10; i++) {
    const newStudent = new Student(CreateStudent(RandomTrueOrFalse()));
    studentList.push(newStudent);
}

Student.insertMany(studentList, (err) => {
    if (err) console.log(err.message);
});

module.exports = {
    FindStudents,
}