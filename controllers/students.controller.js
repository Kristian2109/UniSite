const Student = require("../model/database").studentModel;
const Major = require("../model/database").majorModel;
const { templateSettings } = require("lodash");
const TestData = require("../model/testData");
const CreateTestStudent = TestData.CreateRandomStudent;
const SetPrecision = TestData.GetPrecision;
const PRECISION = 2;

function GetIndexOfMajorByName(majors, nameToSearch) {
    for (let i = 0; i < majors.length; i++) {
        if (majors[i].name === nameToSearch) {
            return i;
        }
    }
    return -1;
}

function GetAvgGrade(grades) {
    return grades.reduce((acc, grade) => acc + grade, 0) / grades.length;
}

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
        let subjectsForAdding;
        if (admin) {
            const major = await Major.findOne({name: student.specialty});
            subjectsForAdding = major.subjects;
            student.disciplines.forEach(disc => {
                subjectsForAdding.remove(disc.name);
            });
        }
        res.render("student", {student, admin, subjectsForAdding});
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
}

async function ModifyStudent(req, res) {
    try {
        const {studentId, majorAddNote, majorDeleteNote, noteToAdd: noteToAddString, noteToDelete: noteToDeleteString, majorToAdd} = req.body;
        let student = await Student.findById(studentId);

        if (majorToAdd) {
            student.disciplines.push({
                name: majorToAdd,
                grades: [],
                avgGradeDisc: 0
            });
            await student.save();
        }

        if (majorDeleteNote) {
            const indexOfMajorDelete = GetIndexOfMajorByName(student.disciplines, majorDeleteNote);
            
            if (indexOfMajorDelete == -1) {
                return res.render("errorPage", {error: "Invalid  major for deleting note!"});
            }

            const noteToDelete = Number(noteToDeleteString);
            if (!noteToDelete || noteToDelete < 2 || noteToDelete > 6) {
                return res.render("errorPage", {error: "Please enter valid note to delete!"});
            }

            let majorToModify = student.disciplines[indexOfMajorDelete];
            majorToModify.grades.remove(noteToDelete);
            majorToModify.avgGradeDisc = SetPrecision(GetAvgGrade(majorToModify.grades), PRECISION);
            await student.save();
        }

        if (majorAddNote) {
            const indexOfMajorAdd = GetIndexOfMajorByName(student.disciplines, majorAddNote);

            if (indexOfMajorAdd == -1) {
                return res.render("errorPage", {error: "Invalid  major for adding note!"});
            }

            const noteToAdd = Number(noteToAddString);
            if (!noteToAdd || noteToAdd < 2 || noteToAdd > 6) {
                return res.render("errorPage", {error: "Please enter valid note to add!"});
            }

            let majorToModify = student.disciplines[indexOfMajorAdd];
            majorToModify.grades.push(noteToAdd);
            majorToModify.avgGradeDisc = SetPrecision(GetAvgGrade(majorToModify.grades), PRECISION);
            await student.save();
        }

        console.log(student);
        res.redirect(`/students/${studentId}`);
    } catch (err) {
        console.log(err);
        res.render("errorPage", {error: err.message});
    }
    
}

async function RenderCreateStudentPage(req, res) {
    return res.render("create");
}

async function CreateStudent(req, res) {
    try {
        const { idNumber, firstName, lastName, email, group, major } = req.body;
        const newStudent = new Student({
            fName: firstName,
            lName: lastName,
            group: Number(group),
            specialty: major,
            disciplines: [],
            avgGrade: 0,
            photoPath: req.file.filename,
            idNumber,
            email,
        });

        await newStudent.save();

        res.redirect(`/students/${newStudent.id}`)

    } catch (err) {
        console.log(err);
        res.render("errorPage", {error: err.message});
    }
}

// function RandomTrueOrFalse() {
//     return Math.floor(Math.random() * 2) == 1;
// }

// const studentList = []
// for (let i = 0; i < 10; i++) {
//     const newStudent = new Student(CreateTestStudent(RandomTrueOrFalse()));
//     studentList.push(newStudent);
// }

// Student.insertMany(studentList, (err) => {
//     if (err) console.log(err.message);
// });

module.exports = {
    FindStudents,
    FindStudentsPage,
    FindOneStudent,
    ModifyStudent,
    CreateStudent,
    RenderCreateStudentPage
}