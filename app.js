//----const vars------------------------------------------------------------
// using `file system` nodejs module in an asynchronous manner
const fs = require('fs').promises;

// for managing cookies
const cookieParser = require('cookie-parser'); 

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

const { RecaptchaV2 } = require('express-recaptcha');

// for managing sesions
const session = require('express-session');

// mongoose module
const mongoose = require('mongoose');

const mongooseSeif = require('express-mongo-sanitize');

// database object Schema
const productSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
});

// model for the object Schema - interface for CRUD operations and not only
const Product = mongoose.model('Product', productSchema);

// app initialization
const app = express();
const port = 6789;

{
// // Replace these with your actual reCAPTCHA keys
// const RECAPTCHA_SITE_KEY = 'your-site-key';
// const RECAPTCHA_SECRET_KEY = 'your-secret-key';

// const recaptcha = new RecaptchaV2(RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY);

// const blockedIPs = new Map();
// const failedAttempts = new Map();
// const CAPTCHA_ATTEMPTS = 3;
// const BLOCK_THRESHOLD = 5;
// const BLOCK_TIME = 60 * 1000; // 1 minute

// // Middleware to check if IP is blocked
// app.use((req, res, next) => {
//     const ip = req.ip;

//     if (blockedIPs.has(ip)) {
//         const blockedTime = blockedIPs.get(ip);
//         if (Date.now() - blockedTime < BLOCK_TIME) {
//             return res.status(403).send('Your IP is temporarily blocked.');
//         } else {
//             blockedIPs.delete(ip);
//             failedAttempts.delete(ip);
//         }
//     }
//     next();
// });

// // Middleware to track failed attempts and trigger CAPTCHA
// app.use((req, res, next) => {
//     res.on('finish', () => {
//         if (res.statusCode === 404) {
//             const ip = req.ip;
//             const attempts = failedAttempts.get(ip) || 0;
//             if (attempts + 1 >= BLOCK_THRESHOLD) {
//                 blockedIPs.set(ip, Date.now());
//             } else {
//                 failedAttempts.set(ip, attempts + 1);
//             }
//         }
//     });
//     next();
// });

// // Middleware to show CAPTCHA if needed
// app.use((req, res, next) => {
//     const ip = req.ip;
//     const attempts = failedAttempts.get(ip) || 0;

//     if (attempts >= CAPTCHA_ATTEMPTS && attempts < BLOCK_THRESHOLD) {
//         return res.redirect('/captcha');
//     }
//     next();
// });

// // Route to show CAPTCHA
// app.get('/captcha', recaptcha.middleware.render, (req, res) => {
//     res.send(`
//         <form action="/validate-captcha" method="POST">
//             ${req.recaptcha}
//             <button type="submit">Submit</button>
//         </form>
//     `);
// });

// // Route to validate CAPTCHA
// app.post('/validate-captcha', recaptcha.middleware.verify, (req, res) => {
//     if (!req.recaptcha.error) {
//         const ip = req.ip;
//         failedAttempts.delete(ip);
//         res.send('CAPTCHA passed, you may proceed.');
//     } else {
//         res.send('CAPTCHA failed, please try again.');
//     }
// });

// const blockedIPs = new Map();
// const failedAttempts = new Map();
// const CAPTCHA_ATTEMPTS = 3;
// const BLOCK_THRESHOLD = 5;
// const BLOCK_TIME = 60 * 1000; // 1 minute

// // Middleware to check if IP is blocked
// app.use((req, res, next) => {
//     const ip = req.ip;

//     if (blockedIPs.has(ip)) {
//         const blockedTime = blockedIPs.get(ip);
//         if (Date.now() - blockedTime < BLOCK_TIME) {
//             return res.status(403).send('Your IP is temporarily blocked.');
//         } else {
//             blockedIPs.delete(ip);
//             failedAttempts.delete(ip);
//         }
//     }
//     next();
// });

// // Middleware to track failed attempts and trigger CAPTCHA
// app.use((req, res, next) => {
//     res.on('finish', () => {
//         if (res.statusCode === 404) {
//             const ip = req.ip;
//             const attempts = failedAttempts.get(ip) || 0;
//             if (attempts + 1 >= BLOCK_THRESHOLD) {
//                 blockedIPs.set(ip, Date.now());
//             } else {
//                 failedAttempts.set(ip, attempts + 1);
//             }
//         }
//     });
//     next();
// });

// // Middleware to show CAPTCHA if needed
// app.use((req, res, next) => {
//     const ip = req.ip;
//     const attempts = failedAttempts.get(ip) || 0;

//     if (attempts >= CAPTCHA_ATTEMPTS && attempts < BLOCK_THRESHOLD) {
//         return res.redirect('/captcha');
//     }
//     next();
// });

// // Function to generate a simple CAPTCHA
// function generateCaptcha() {
//     const num1 = Math.floor(Math.random() * 10);
//     const num2 = Math.floor(Math.random() * 10);
//     return {
//         question: `What is ${num1} + ${num2}?`,
//         answer: (num1 + num2).toString()
//     };
// }

// // Route to show CAPTCHA
// app.get('/captcha', (req, res) => {
//     const captcha = generateCaptcha();
//     req.session.captcha = captcha.answer;
//     res.send(`
//         <form action="/validate-captcha" method="POST">
//             <p>${captcha.question}</p>
//             <input type="text" name="captcha" required>
//             <button type="submit">Submit</button>
//         </form>
//     `);
// });

// // Route to validate CAPTCHA
// app.post('/validate-captcha', (req, res) => {
//     if (req.body.captcha === req.session.captcha) {
//         const ip = req.ip;
//         failedAttempts.delete(ip);
//         res.send('CAPTCHA passed, you may proceed.');
//     } else {
//         res.send('CAPTCHA failed, please try again.');
//     }
// });
}
//--------------------------------gooooood below
const blockedIPs = new Map();
const failedAttempts = new Map();
const BLOCK_THRESHOLD = 5;
const BLOCK_TIME = 1; // 1 minute



const loginAttempts = new Map();
const LOGIN_ATTEMPT_THRESHOLD = 5;
const LOGIN_BLOCK_TIME = 60000; // 1 minute

// Middleware to check if IP is blocked
app.use((req, res, next) => { 
    const ip = req.ip;

    if (blockedIPs.has(ip)) {
        const blockedTime = blockedIPs.get(ip);
        if (Date.now() - blockedTime < BLOCK_TIME) {
            return res.status(403).send('Your IP is temporarily blocked.');
        } else {
            blockedIPs.delete(ip);
            failedAttempts.delete(ip);
        }
    }
    next();
});

// Middleware to track failed attempts
app.use((req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode === 404) {
            const ip = req.ip;
            const attempts = failedAttempts.get(ip) || 0;
            if (attempts + 1 >= BLOCK_THRESHOLD) {
                blockedIPs.set(ip, Date.now());
            } else {
                failedAttempts.set(ip, attempts + 1);
            }
        }
    });
    next();
});

const rateLimit = require("express-rate-limit");
const limit = rateLimit({
    windowMs: 5 * 6000,
    max: 3,
    message: "Too many failed trials!",
    handler: function (req, res) {
        // Redirect to CAPTCHA route when rate limit is exceeded
        res.redirect("/captcha");
    }
});

{
//----------------------------------goooooofyyyyy
// // Middleware to check if IP is blocked from logging in
// app.use('/verificare-autentificare', (req, res, next) => {
//     const ip = req.ip;

//     if (loginAttempts.has(ip)) {
//         const { count, lastAttemptTime } = loginAttempts.get(ip);
//         if (count >= LOGIN_ATTEMPT_THRESHOLD && Date.now() - lastAttemptTime < LOGIN_BLOCK_TIME) {
//             return res.status(403).send('Your IP is temporarily blocked from logging in.');
//         } else if (Date.now() - lastAttemptTime >= LOGIN_BLOCK_TIME) {
//             loginAttempts.delete(ip);
//         }
//     }
//     next();
// });

// // Middleware to track failed login attempts
// app.post('/verificare-autentificare', (req, res, next) => {
//     const ip = req.ip;

//     res.on('finish', () => {
//         if (res.statusCode !== 302) { // Assuming a successful login redirects with 302 status code
//             const { count = 0, lastAttemptTime = Date.now() } = loginAttempts.get(ip) || {};
//             loginAttempts.set(ip, { count: count + 1, lastAttemptTime: Date.now() });

//             if (count + 1 >= LOGIN_ATTEMPT_THRESHOLD) {
//                 blockedIPs.set(ip, Date.now());
//             }
//         } else {
//             loginAttempts.delete(ip); // Reset on successful login
//         }
//     });

//     next();
// });

// // Middleware to track failed login attempts and block access if necessary
// app.use('/verificare-autentificare', (req, res, next) => {
//     const ip = req.ip;

//     if (loginAttempts.has(ip)) {
//         const { count, lastAttemptTime } = loginAttempts.get(ip);
//         if (count >= LOGIN_ATTEMPT_THRESHOLD && Date.now() - lastAttemptTime < LOGIN_BLOCK_TIME) {
//             return res.status(403).send('Your IP is temporarily blocked from logging in.');
//         } else if (Date.now() - lastAttemptTime >= LOGIN_BLOCK_TIME) {
//             loginAttempts.delete(ip);
//         }
//     }
//     next();
// });

// // Middleware to update login attempts after checking credentials
// app.post('/verificare-autentificare', (req, res, next) => {
//     const ip = req.ip;

//     res.on('finish', () => {
//         if (res.statusCode !== 302) { // Assuming a successful login redirects with 302 status code
//             const { count = 0, lastAttemptTime = Date.now() } = loginAttempts.get(ip) || {};
//             loginAttempts.set(ip, { count: count + 1, lastAttemptTime: Date.now() });

//             if (count + 1 >= LOGIN_ATTEMPT_THRESHOLD && Date.now() - lastAttemptTime < LOGIN_BLOCK_TIME) {
//                 blockedIPs.set(ip, Date.now());
//             }
//         } else {
//             loginAttempts.delete(ip); // Reset on successful login
//         }
//     });

//     next();
// });
}

const recaptcha = new RecaptchaV2('SITE_KEY', 'SECRET_KEY');
// Route to display CAPTCHA
app.get('/captcha', recaptcha.middleware.render, (req, res) => {
    res.send(`
    <form action="/validate-captcha" method="POST">
      ${req.recaptcha}
      <button type="submit">Submit</button>
    </form>
  `);
});

// Route to validate CAPTCHA
app.post("/validate-captcha", recaptcha.middleware.verify, (req, res) => {
    if (!req.recaptcha.error) {
        // CAPTCHA passed, allow the user to proceed
        res.send("CAPTCHA passed, you may proceed.");
    } else {
        // CAPTCHA failed, block the request
        res.status(403).send("CAPTCHA failed, access denied.");
    }
});
//-------------------------------------------------------------------------

// 'views' folder contains EJS Files (html + js server-side executed)
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// cookie parser module
app.use(cookieParser());

//app.use(mongooseSeif());

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
    res.locals.dbLoad = req.session.dbLoad;
    res.locals.cart = req.session.cart;
    res.locals.admin = req.session.admin;

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
app.get('/', async (req, res) => {
    // sending data from the database
    if (req.session.dbLoad) {
        console.log('ciorba de cal');
        const products = await Product.find({})
        // await mongoose.disconnect();
        res.render('index', { products });
    } else {
        res.redirect('connect-db');
        //res.render('index');
    }
    // checks if login was successful
    // if (req.cookies.login){
    //     const login = req.cookies.login;
    //     const user = req.cookies.username;
    //     // console.log(login, user);
    // }
    // else{
    //     //res.render('index');
    // }
    
});


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
            console.log(submittedAnswers);

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
}
//------------------------------------------------------------------------

//----LOGIN---------------------------------------------------------------
{
app.get('/autentificare', (req, res) => {
    if (req.cookies.errMsg){
        const errMsg = req.cookies.errMsg;
        console.log(errMsg);
        res.clearCookie('errMsg');
        res.render('autentificare', { errMsg });
    }
    else{
        res.render('autentificare', { errMsg : 0 });
    }
    
});

app.post('/verificare-autentificare', limit, (req, res) => {
    console.log(req.body);
    // res.send(req.body);
    const userData = req.body;
    const users = require('./users.json');
    if (users.find(u => u.username === userData.username && u.password === userData["user-password"])){
        console.log("loged soup :)");

        // set a cookie with the username
        res.cookie('username', userData["username"]);
        res.cookie('login', '1');

        req.session.login = 1;
        req.session.username = userData.username;

        // redirecting
        res.redirect('/');
    }
    else{
        const admins = require('./admin-users.json');
        if (admins.find(u => u.username === userData.username && u.password === userData["user-password"])) {
            console.log("loged soup :)");

            // set a cookie with the username
            res.cookie('username', userData["username"]);
            res.cookie('login', '1');

            req.session.login = 1;
            req.session.username = userData.username;
            req.session.admin = 1;

            // redirecting
            res.redirect('/');
        }
        else{
            console.log("badly loged soup :(");
            res.cookie('errMsg', 'Username or password does not match!');
            res.redirect('http://localhost:6789/autentificare');
        }
    }
});
}
//------------------------------------------------------------------------

//----SIGNUP--------------------------------------------------------------
{
app.get('/signUp', (req, res) => {
    if (req.cookies.errorMsg) {
        const errMsg = req.cookies.errorMsg;
        console.log(errMsg);
        res.clearCookie('errorMsg');
        res.render('signUp', { errMsg });
    }
    else {
        res.render('signUp', { errMsg: 0 });
    }
});

app.post('/signUp-verification', (req, res) => {
    console.log(req.body);
    const userData = req.body;
    try {
        const users = require('./users.json');

        console.log(userData.username);

        // user already exists
        if (users.find(u => u.username === userData.username)) {
            console.log("Signed Up bad :(");
            res.cookie('errorMsg', 'Username already in use!');
            res.redirect('http://localhost:6789/signUp');
            return; // exit to prevent further execution
        }

        users.push(userData);

        let fs2 = require('fs');

        fs2.writeFile('users.json', JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('User added successfully.');
        });

        // set a cookie with the username
        res.cookie('username', userData["username"]);
        res.cookie('firstName', userData["firstName"]);
        res.cookie('lastName', userData["lastName"]);
        res.cookie('email', userData["email"]);
        res.cookie('login', '1');

        // redirecting
        res.redirect('http://localhost:6789/');
        
    } catch (error) {
        // handle any errors 
        console.error('Error reading or parsing file:', error);
        res.status(500).send('Internal Server Error');
    }
});
}
//------------------------------------------------------------------------

//----LOGOUT--------------------------------------------------------------
{
app.get('/logout', (req, res) => {
    req.session.destroy(async (err) => {
        if (err) {
            console.error('Error at logout:', err);
        } else {
            res.clearCookie('username');
            res.clearCookie('login');

            delete res.locals.username;
            delete res.locals.login;
            delete res.locals.dbLoad;

            await mongoose.disconnect();

            res.redirect('/');
        }
    });   
});
}
//------------------------------------------------------------------------

//----DataBase------------------------------------------------------------
{
app.get('/create-db', async (req, res) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/products');

        await Product.createCollection();

        await mongoose.disconnect();

        res.redirect('/connect-db');
    } catch (error) {
        console.error('Error at creating the database: ', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/load-db', async (req, res) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/products');

        // 
        const data = await fs.readFile('products-backup.json');
        const products = JSON.parse(data);

        // delete old data
        await Product.deleteMany({});
        console.log('All products deleted successfully');

        // NEVER use forEach with async
        for (const product of products) {
            const prod = new Product(product);
            await prod.save();
            console.log('Product saved successfully:', prod);
        }
        
        await mongoose.disconnect();

        res.redirect('/connect-db');
        //

    } catch (error) {
        console.error('Error at populating the database: ', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/connect-db', async (req, res) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/products');
        req.session.dbLoad = 1;
        res.redirect('/');
    } catch (error) {
        console.error('Error at connecting to the database: ', error);
        res.status(500).send('Internal Server Error');
    }
});

// app.get('/clear-db', async (req, res) => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/products');

//         await Product.deleteMany({});
//         console.log('All products deleted successfully');

//         await mongoose.disconnect();

//         req.session.dbLoad = 0;

//         res.redirect('/');
//         //

//     } catch (error) {
//         console.error('Error at populating the database: ', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
}
//------------------------------------------------------------------------

//----ShoppingCart--------------------------------------------------------
{
app.get('/add-to-cart', (req, res) => {
    const productId = req.query.id;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const prodIndex = req.session.cart.findIndex(item => item.productId === productId);
    if (prodIndex > -1) {
        req.session.cart[prodIndex].quantity += 1;
    } else {
        req.session.cart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    console.log(req.session.cart);
    res.redirect('/');
});

app.get('/shopping-cart', async (req, res) => {
    if (req.session.login) {
        await mongoose.connect('mongodb://localhost:27017/products');

        if (!req.session.cart || req.session.cart.length === 0) {
            await mongoose.disconnect();
            return res.render('shopping-cart', { products: [] });
        }

        try {
            const productPromises = req.session.cart.map(async (cartItem) => {
                return Product.findOne({ productId: cartItem.productId });
            });

            const products = await Promise.all(productPromises);
            await mongoose.disconnect();
            res.render('shopping-cart', { products });
        } catch (error) {
            console.error('Error fetching products:', error);
            await mongoose.disconnect();
            res.status(500).send('Error fetching products');
        }
    } else {
        res.redirect('/logout');
    }
});
}
//------------------------------------------------------------------------

//----Admin---------------------------------------------------------------
{
app.get('/admin', async (req, res) => {
    if (req.session.admin) {
        await mongoose.connect('mongodb://localhost:27017/products');
        const lastId = await Product.findOne().sort({ productId: -1 }).limit(1);
        res.render('admin', { lastId: String(Number(lastId.productId) + 1).padStart(lastId.productId.length, '0') });
    } else {
        res.redirect('/logout');
    }
});

app.post('/add-product', async (req, res) => {
    if (req.session.admin) {
        const product = req.body;
        console.log(product);
        try {
            const notJson = await fs.readFile('products-backup.json');
            const prodData = JSON.parse(notJson);
            prodData.push(product);
            fs.writeFile('products-backup.json', JSON.stringify(prodData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('Product added successfully.');
            });
            res.redirect('load-db');
        } catch (error) {
            // handle any errors 
            console.error('Error reading or parsing file:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/logout');
    }    
});
}
//------------------------------------------------------------------------

app.listen(port, () => console.log('Server runing at http://localhost:' + port));