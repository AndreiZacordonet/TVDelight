//----const vars------------------------------------------------------------
// using `file system` nodejs module in an asynchronous manner
const fs = require('fs').promises;

// for managing cookies
const cookieParser = require('cookie-parser'); 

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

// for managing sesions
const session = require('express-session');

// app initialization
const app = express();
const port = 6789;
//-------------------------------------------------------------------------

// 'views' folder contains EJS Files (html + js server-side executed)
app.set('view engine', 'ejs');

// cookie parser module
app.use(cookieParser());

// session module
app.use(session({
    secret: 'secret',   // for cookie encription
    resave: false,      // session is saved back to session store for every request
    saveUninitialized: true     // a session is created for each request
}));

app.use((req, res, next) => {
    // adding variables to `res.locals` which is available for all views
    res.locals.username = req.session.username;
    res.locals.login = req.session.login;

    next();     // next middleware in the stack
});

// support for layouts - default template file is 'views/layout.ejs'
app.use(expressLayouts);

// 'public' Folder contains all client-accesible resources (e.g., css, javascript, images , etc.)
app.use(express.static('public'))

// message body can be translated as JSON; JSON Form data is in `req.body`
app.use(bodyParser.json());

// deep parsing algorithm that supports nested objects
app.use(bodyParser.urlencoded({ extended: true }));

// Request object properties - req - https://expressjs.com/en/api.html#req
// Response object properties - res - https://expressjs.com/en/api.html#res
// returns hello world when accesing http://localhost:6789/
// app.get('/', (req, res) => res.send('Hello World'));
app.get('/', (req, res) => {
    // checks if login was successful
    if (req.cookies.login){
        const login = req.cookies.login;
        const user = req.cookies.username;
        console.log(login, user);
        res.render('index', { login : login , user : user });
    }
    else{
        res.render('index', { login : 0, user : undefined })
    }
    
});
// app.get('/', (req, res) => res.render('layout', { id: 'layout' }));


//----Quiz----------------------------------------------------------------
{
// called when accesing http://localhost:6789/chestionar 
app.get('/chestionar', (req, res) => {
    // reads the quiz from file in an syncronous manner 
    // const quiz = require('intrebari.json');

    fs.readFile('intrebari.json')
        // `.then` method is executed only when the file reading is successful
        .then(data => {
            // parsing JSON data
            const quiz = JSON.parse(data);
            // render the 'chestionar' view with the quiz data
            res.render('chestionar', { quiz,  login: 1 , user : req.cookies.username });
        })
        .catch(error => {
            // handle any errors
            console.error('Error reading or parsing file:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/rezultat-chestionar', (req, res) => {
    // res.send("formular: " + JSON.stringify(req.body));

    fs.readFile('intrebari.json')
        // `.then` method is executed only when the file reading is successful
        .then(data => {
            // parsing JSON data
            const quiz = JSON.parse(data);

            // taking the post request from the Quiz Form
            const submittedAnswers = req.body;
            let correctAns = 0;

            // parsing the object from request
            Object.keys(submittedAnswers).forEach((questionKey) => {
                const questionIndex = parseInt(questionKey.slice(1));

                const submittedAnswerIndex = parseInt(submittedAnswers[questionKey]);

                // every question has a correct option
                const correct = quiz[questionIndex].correct;

                if (submittedAnswerIndex == correct) {
                    correctAns++;
                }
            });

            // seding the number of correct anwers to the Result File
            res.render('rezultat-chestionar', { correctAns, login : 1 });
        })
        .catch(error => {
            // handle any errors
            console.error('Error reading or parsing file:', error);
            res.status(500).send('Internal Server Error');
        });
});
}
//------------------------------------------------------------------------

//----LOGIN---------------------------------------------------------------
{
app.get('/autentificare', (req, res) => {
    if (req.cookies.errorMsg){
        const errMsg = req.cookies.errorMsg;
        console.log(errMsg);
        res.clearCookie('errorMsg');
        res.render('autentificare', { login: 0 , errMsg });
    }
    else{
        res.render('autentificare', { login : 0 , errMsg : 0 });
    }
    
});

app.post('/verificare-autentificare', (req, res) => {
    console.log(req.body);
    // res.send(req.body);
    const userData = req.body;
    if (userData["username"] == "user" && userData["user-password"] == "pass"){
        console.log("loged soup :)");

        // set a cookie with the username
        res.cookie('username', userData["username"]);
        res.cookie('login', '1');

        // redirecting
        res.redirect('http://localhost:6789/');
    }
    else{
        console.log("badly loged soup :(");
        res.cookie('errorMsg', 'Username or password does not match!');
        res.redirect('http://localhost:6789/autentificare');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error at logout:', err);
        } else {
            res.clearCookie('username');
            res.clearCookie('login');
            res.redirect('/');
        }
    });
    // res.clearCookie('username');
    // res.clearCookie('login');
    // res.redirect('/');      
});
}
//------------------------------------------------------------------------

app.listen(port, () => console.log('Server runing at http://localhost:' + port));