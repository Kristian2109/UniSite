const { Student } = require("./database");
const TestStudent = require("./students.test");
const { SetPrecision, CreateRandomStudent } = TestStudent;

const PRECISION = 2;

function AddDisciplineToStudent(student, disciplineToAdd) {
    student.disciplines.push({
        name: disciplineToAdd,
        grades: [],
        avgGradeDisc: 0
    });
} 

function UpdateStudentAverageGrade(student) {

    const sumOfGrades = student.disciplines.reduce((acc, disc) => {
        return acc + disc.avgGradeDisc;
    }, 0);

    const countSubjectsWithGrade = student.disciplines.reduce((acc, disc) => {
        return (disc.avgGradeDisc == 0) ? acc : acc + 1;
    }, 0);

    const newAvgGrade = sumOfGrades / countSubjectsWithGrade;

    student.avgGrade = SetPrecision(newAvgGrade, PRECISION);
}

function DeleteNoteOfDiscipline(student, indexOfDisciplineDelete, noteToDelete) {
    let majorToModify = student.disciplines[indexOfDisciplineDelete];
    majorToModify.grades.remove(noteToDelete);
    
    if (majorToModify.grades.length == 0) {
        majorToModify.avgGradeDisc = 0;
    } else {
        majorToModify.avgGradeDisc = SetPrecision(Average(majorToModify.grades), PRECISION);
    }

    UpdateStudentAverageGrade(student);
}

function AddNoteToDiscipline(student, indexOfDisciplineAdd, noteToAdd) {
    let majorToModify = student.disciplines[indexOfDisciplineAdd];

    majorToModify.grades.push(noteToAdd);
    majorToModify.avgGradeDisc = SetPrecision(Average(majorToModify.grades), PRECISION);
    
    UpdateStudentAverageGrade(student);
}

function Average(array) {
    return array.reduce((acc, num) => acc + num, 0) / array.length;
} 

function RandomTrueOrFalse() {
    return Math.floor(Math.random() * 2) == 1;
}

async function InsertRandomStudents(count) {
    for (let i = 0; i < count; i++) {
        const newStudent = new Student(CreateRandomStudent(RandomTrueOrFalse()));
        await newStudent.save();
    }
}

module.exports = {
    AddDisciplineToStudent,
    UpdateStudentAverageGrade,
    DeleteNoteOfDiscipline,
    AddNoteToDiscipline,
    InsertRandomStudents
}