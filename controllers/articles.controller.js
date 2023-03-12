const { News } = require("../model/database");
const _ = require("lodash");

async function GetArticles(req, res) {
    try {
        const articles = await News.find({});
        const admin = req.user;
        return res.render("home", { news: articles, admin });

    } catch (err) {
        console.error(err);
        res.render("home");
    }
}

async function GetOneArticle(req, res) {
    try {
        const articleTitle = _.capitalize(req.params.articleTitle);
        const article = await News.findOne({title: articleTitle});
        console.log(article);

        if (!article) {
            return res.render("article", {article: {
                title: "This article doesn't exsists!",
                content: "Please go to the home page.",
                images: [] 
                }
            });
        }

        return res.render("article", {article});

    } catch (err) {
        console.error(err);
        res.redirect("/");
    }
    
}

module.exports = {
    GetArticles,
    GetOneArticle
}