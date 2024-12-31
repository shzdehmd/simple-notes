const express = require('express');
const njk = require('nunjucks');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const title = process.env.TITLE || 'simple-notes';

const db = new DatabaseSync('./sqlite.db');

// CREATE THE DEFAULT USERS TABLE
db.exec(`
    CREATE TABLE IF NOT EXISTS Users(
        id INTEGER PRIMARY KEY,
        fname TEXT,
        lname TEXT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

njk.configure('views', {
    express: app,
    autoescape: true,
});
app.set('view engine', 'html');

app.use(express.static('./public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index.html', { title });
});

app.get('/register', (req, res) => {
    res.render('register.html', { title });
});

app.post('/register', (req, res) => {
    const { fname, lname, username, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const insert = db.prepare('INSERT INTO Users (fname, lname, username, password) VALUES (?, ?, ?, ?)');

    try {
        insert.run(fname, lname, username, hash);
    } catch (err) {
        if (err) {
            return res.status(500).json({
                code: 500,
                error: 'internal server error',
                message: err.message,
            });
        }
    }

    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login.html', { title });
});

app.all('*', (req, res) => {
    res.status(404).json({
        code: 404,
        error: 'not found',
        message: "the resource you are looking for isn't available on this server.",
    });
});

app.listen(PORT, () => {
    console.log(`${title} is running at http://${HOST}:${PORT}`);
});
