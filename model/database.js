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

// News.findOne({title: "News 1"}, (err, item) => {
//     item.images[0].title = "Breaking news";
//     item.save((err) => {
//         if (err)  console.log(err.message);
//     });
// })

module.exports = {
    newsModel: News
}