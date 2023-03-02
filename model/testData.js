const PRECISION_POINTS = 2;
const COUNT_GROUPS = 10;
const _ = require("lodash");


const menFirstNames = ["Ivan",  "Peter", "Georgi", "Miro",  "Alexander", "Kristian", "Dimitur"];
const womenFirstNames = ["Maria", "Silvia", "Ivanka", "Petya", "Alexandra", "Kristina"];
const menSecondNames = ["Ivanov", "Petrov", "Georgiev", "Alexandrov", "Dimitrov", "Iordanov"];
const womenSecondNames = ["Ivanova", "Petrova", "Georgieva", "Alexandrova", "Dimitrova", "Iordanova"];
const specialties = ["Informatics", "Philosophy", "Psychology", "Mathematics", "Engineering", "Medicine"];
const subjects = ["Math", "Design", "English", "Sport", "Algorithms", "Statistics", "Economy", "Algebra", "Discrete Math", "Geography", "Artificial Intelligence", "Databases", "Anatomy"];

const randomFName = menFirstNames[WholeRandom(menFirstNames.length - 1)];
const randomLName = menSecondNames[WholeRandom(menSecondNames.length - 1)];

function CreateRandomStudent(isMan) {
    let randomFName;
    let randomLName;
    if (isMan) {
        randomFName = menFirstNames[WholeRandom(menFirstNames.length - 1)];
        randomLName = menSecondNames[WholeRandom(menSecondNames.length - 1)];
    } else {
        randomFName = womenFirstNames[WholeRandom(womenFirstNames.length - 1)];
        randomLName = womenSecondNames[WholeRandom(womenSecondNames.length - 1)]; 
    }

    const disciplines = CreateDisciplinesObject();
    const avgGrade = SetPrecision(disciplines.reduce((acc, disc) => acc + disc.avgGradeDisc, 0)
                     / disciplines.length, PRECISION_POINTS);

    const student = {
        fName: randomFName,
        lName: randomLName,
        email: CreateEmail(randomFName, randomLName),
        photoPath: "profileImage.jpg",
        group: WholeRandom(COUNT_GROUPS - 1) + 1,
        specialty: specialties[WholeRandom(specialties.length - 1)],
        disciplines: disciplines,
        avgGrade: avgGrade
    }

    return student;
}

function CreateDisciplinesObject() {
    result = [];
    const randomDisciplines = CreateRandomSubjectsList();
    const randomGrades = CreateRandomGrades(randomDisciplines.length);
    for (let i = 0; i < randomDisciplines.length; i++) {
        const avgGrade = SetPrecision(AvgOfArr(randomGrades[i]) / randomGrades[i].length,
                                               PRECISION_POINTS);
        result.push({
            name: randomDisciplines[i],
            grades: randomGrades[i],
            avgGradeDisc: avgGrade,
        });
    }

    return result;
}

function AvgOfArr(arr) {
    let result = 0;
    arr.forEach(element => {
        result += element;
    });

    return result;
}

function CreateRandomSubjectsList() {

    const usedIndexes = [];
    const randomSpecialties = [];

    const randomLength = (WholeRandom(7) + 3);
    for (let i = 0; i < randomLength; i++) {
        const randomIndex = WholeRandom(subjects.length - 1);

        if (usedIndexes.indexOf(randomIndex) == -1) {
            
            usedIndexes.push(randomIndex);
            randomSpecialties.push(subjects[randomIndex]);
        } 
        else i--;
    }
    return randomSpecialties;
}

function CreateRandomGrades(numberSubjects) {
    const result = [];

    for (let i = 0; i < numberSubjects; i++) {
        const gradesForSubject = [];

        for (let numNotes = 0; numNotes < (WholeRandom(3) + 2); numNotes++) {
            gradesForSubject.push(SetPrecision(Random(4) + 2, PRECISION_POINTS));
        }

        result.push(gradesForSubject);
    }

    return result;
}

function WholeRandom(max) {
    return Math.floor(Math.random() * (max + 1));
}

function Random(max) {
    return SetPrecision(Math.random() * max, PRECISION_POINTS);
}


function SetPrecision(number, precisionPoints) {
    const tenOfPowerPrecision = Math.pow(10, precisionPoints);
    const numberMultiplyed = number * tenOfPowerPrecision;
    return Math.floor(numberMultiplyed) / tenOfPowerPrecision;
}

function CreateEmail(fName, lName) {
    return _.toLower(fName) + "." + _.toLower(lName) + "@gmail.com";
}

module.exports = {
    GetPrecision: SetPrecision,
    Random, 
    CreateEmail, 
    CreateRandomSubjectsList, 
    CreateRandomGrades,
    CreateDisciplinesObject,
    CreateRandomStudent
}
