const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB", () => {
    console.log("Connected to Mongo Database!");
});

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model("article", articlesSchema);
//Targeting Single
app.route("/articles/:title")
    .post((req, res) => {
        Article.findOne({title: req.params.title}, (error, result) => {
            if (!error) {
                if (result) {
                    res.send(result)
                } else {
                    res.send("Not found!");
                }
            } else {
                console.log(error);
            }
        });
    })

    .put((req, res) => {
        Article.updateOne(
            {title: req.params.title},
            {
                title: req.body.title,
                content: req.body.content
            },
            (error, results) => {
                if (!error) {
                    res.send(results);
                    console.log(results);
                } else {
                    res.send("Error!")
                    console.log(error);
                }
            }
        )   
    });

//Targeting all
app.route("/articles")
    .get((req, res) => {
        Article.find({}, (error, results) => {
            if (!error) {
                res.send(results);
            } else {
                res.send(error);
            }
        });
    })

    .post((req, res) => {
            console.log(req.body.title);
            console.log(req.body.content);

            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });

        newArticle.save((error) => {
            if (!error) {
                res.send("Successfully saved new Article!")
                console.log("Saved Article!");
            } else {
                console.log(error);
                res.send("Error");
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((error) => {
            if (!error) {
                res.send("Deleted successfully!");
                console.log("Deleted");
            } else {
                res.send("Error");
                console.log(error);
            }
        });
    });

app.listen(3000, () => {
    console.log("Started on Port 3000!");
});