const News = require("../model/database").newsModel;

function GetArticles(req, res) {
    News.find({}, (err, items) => {
        if (err) {
            console.log(err.message);
        }
        else if (items.length === 0) {
            res.render("home", {news: []});
        } else {
            res.render("home", {news: items});
        }
    });
}

function GetOneArticle(req, res) {
    const articleTitle = _.capitalize(req.params.articleTitle);
    News.findOne({title: articleTitle}, (err, result) => {
        if (err) {
            console.log(err.message);
            res.redirect("/");
        } else if (result) {
            res.render("article", {article: result});
        } else {
            res.render("article", {article: {
                title: "This article doesn't exsists",
                content: "Please go to the home page"
                }
            });
        }
    });
}

module.exports = {
    GetArticles,
    GetOneArticle
}