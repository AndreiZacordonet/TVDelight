const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const app = express();
const port = 6789;

// using `file system` nodejs module in an asynchronous manner
const fs = require('fs').promises;

// 'views' folder contains EJS Files (html + js server-side executed)
app.set('view engine', 'ejs');

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
app.get('/', (req, res) => res.send('Hello World'));
// app.get('/', (req, res) => res.render('layout', req.query));

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
            res.render('chestionar', { quiz });
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
            res.render('rezultat-chestionar', { correctAns });
        })
        .catch(error => {
            // handle any errors
            console.error('Error reading or parsing file:', error);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => console.log('Server runing at http://localhost:' + port));