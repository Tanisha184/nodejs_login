const express = require('express');

const router = express.Router();

// const auth = require('./auth');

router.get('/',(req, res) =>{
    res.render('index');
});

router.get('/register',(req, res) =>{
    res.render('register');
});

router.get('/login',(req, res) =>{
    res.render('login');


});



module.exports = router;