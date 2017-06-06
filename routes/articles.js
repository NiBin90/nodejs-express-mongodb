const express = require('express');
const router = express.Router();

//Bring in Book Model
let Article = require('../models/article');

//Update Single article
router.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit the book',
            article: article
        });
    });
});

//Add Route
router.get('/add', (req, res) => {
    res.render('addarticle', {
        article: 'Add Article'
    });
});


//Post Arcticle to the db
router.post('/add', (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('addarticle', {
            title: 'Add Article',
            errors: errors
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save((err) => {
            if (err) {
                console.log(err);
            } else {
                req.flash('success', 'Book Added!');
                res.redirect('/');
            }
        });
        console.log(req.body.title);
        return;
    }
});

//Update Arcticle to the db
router.post('/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id };

    Article.update(query, article, (err) => {
        if (err) {
            console.log(error);
        } else {
            req.flash('success', 'Book Updated!');
            res.redirect('/');
        }
    })
    console.log('update ' + req.body.title);
    return;
});

//Delete book
router.delete('/:id', (req, res) => {
    let query = { _id: req.params.id };

    Article.remove(query, (err) => {
        if (err) {
            console.log(err);
        }
        req.flash('success', 'Book Deleted!');
        res.send('Success!');
    });
});

//Get Single article
router.get('/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
    });
});
module.exports =router;
