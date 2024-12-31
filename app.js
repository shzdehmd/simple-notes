const express = require('express');
const njk = require('nunjucks');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const title = process.env.TITLE || 'simple-notes';

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
    console.log(req.body);
    res.send('registered.');
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
