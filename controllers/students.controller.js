const Student = require("../model/database").studentModel;

function FindStudents(req, res) {
    Student.find({}, (err, students) => {
        res.render("students", {students: students});
    });
}

module.exports = {
    FindStudents,
}