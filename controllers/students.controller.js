const { Student, majorModel: Major } = require("../model/database");
const studentMethods = require("../model/students.model");
const fs = require("fs");
const path = require("path");


// Minor helper function I don't want to import
function FindDisciplineIndexByName(majors, nameToSearch) {
    for (let i = 0; i < majors.length; i++) {
        if (majors[i].name === nameToSearch) {
            return i;
        }
    }
    return -1;
} 

// ------------- Render Students Controller ------------- \\

async function RenderStudentsPage(req, res) {
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

// ------------- Render Single Student Controller ------------- \\

async function RenderSigleStudentPage(req, res) {
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

        return res.render("student", {student, admin, subjectsForAdding});
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
}

// ------------- Modify Student Controller ------------- \\

async function ModifyStudent(req, res) {
    try {
        const {
            studentId,
            disciplineAddNote,
            disciplineDeleteNote,
            disciplineToAdd,
            noteToAdd: noteToAddString,
            noteToDelete: noteToDeleteString
        } = req.body;

        let student = await Student.findById(studentId);

        if (disciplineToAdd) {

            if (student.disciplines.length > 9) {
                return res.render("errorPage", { error: "The disciplines are alerady 10!" });
            }

            studentMethods.AddDisciplineToStudent(student, disciplineToAdd);
        }

        if (disciplineDeleteNote) {
            const indexOfDisciplineDelete = FindDisciplineIndexByName(student.disciplines, disciplineDeleteNote);

            if (indexOfDisciplineDelete === -1) {
                return res.render("errorPage", {error: "Invalid  major for deleting note!"});
            }

            const noteToDelete = Number(noteToDeleteString);
            if (!noteToDelete || noteToDelete < 2 || noteToDelete > 6) {
                return res.render("errorPage", {error: "Please enter valid note to delete!"});
            }

            studentMethods.DeleteNoteOfDiscipline(student, indexOfDisciplineDelete, noteToDelete)
        }

        if (disciplineAddNote) {
            const indexOfDisciplineAdd = FindDisciplineIndexByName(student.disciplines, disciplineAddNote);

            if (indexOfDisciplineAdd == -1) {
                return res.render("errorPage", {error: "Invalid  major for adding note!"});
            }

            const noteToAdd = Number(noteToAddString);
            if (!noteToAdd || noteToAdd < 2 || noteToAdd > 6) {
                return res.render("errorPage", {error: "Please enter valid note to add!"});
            }

            studentMethods.AddNoteToDiscipline(student, indexOfDisciplineAdd, noteToAdd);
        }

        console.log(student);
        await student.save();

        return res.redirect(`/students/${studentId}`);
    } catch (err) {
        console.log(err);
        return res.render("errorPage", {error: err.message});
    }
}

// ------------- Render Create Controller ------------- \\

async function RenderCreateStudentPage(req, res) {
    try {
        if (req.isAuthenticated()) {
            return res.render("create");
        } else {
            return res.render("errorPage", { error: "You aren't authorized for this action!" });
        }
    } catch (error) {
        return res.render("errorPage", {error: err.message});
    }
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

        const imagePath = path.join(__dirname, "../public/images/studentImages/", newStudent.photoPath);

        fs.readFile(imagePath, (err, data) => {
            if (err) throw err;
          
            console.log(data);
            newStudent.photo.image = {
                data: data,
                contentType: "image/jpg"
            }
        });
        console.log(req.file);

        await newStudent.save();

        return res.redirect(`/students/${newStudent.id}`)

    } catch (err) {
        console.log(err);
        return res.render("errorPage", {error: err.message});
    }
}

module.exports = {
    RenderStudentsPage,
    FindStudentsPage,
    RenderSigleStudentPage,
    ModifyStudent,
    CreateStudent,
    RenderCreateStudentPage
}