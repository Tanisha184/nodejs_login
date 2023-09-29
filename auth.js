const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: 'nodejs_login'
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordconfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results && results.length > 0) {
            return res.render('register', {
                message: 'That email is already taken'
            })
        } else if (password !== passwordconfirm) {
            return res.render('register', {
                message: 'Passwords Do not Match'
            });
        }


        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query("INSERT INTO users SET ? ", { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: "User registered"
                });
            }
        });

    });



}

//loginnnnnnnnnnnnnnnnnn
exports.login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    db.query('SELECT email, password FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render("login", {
                message: 'An error occurred'
            });
        }
        if (results && results.length === 0) {
            return res.render("login", {
                message: 'User with this email does not exist'
            });
        } else {
            const hashedPassword = results[0].password;
            bcrypt.compare(password, hashedPassword, (compareError, isPasswordMatch) => {
                if (compareError) {
                    console.log(compareError);
                    return res.render("login", {
                        message: 'An error occurred during password comparison'
                    });
                }
                if (isPasswordMatch) {
                    // Here, isPasswordMatch indicates whether the password is correct.
                    return res.render('dashboard', {
                        message: 'Login successful'
                    });
                } else {
                    // isPasswordMatch is false when the password is incorrect.
                    return res.render('login', {
                        message: 'Incorrect password'
                    });
                }
            });
        }
    });
};

const userLogout = async(req, res)=>{
    try{
        req.session.destroy();
        res.redirect('/login')
    }catch (error){

        console.log(error.message);
    }


}