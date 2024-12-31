const express = require('express');
const njk = require('nunjucks');

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

app.get('/', (req, res) => {
    res.render('index.html', { title });
});

app.get('/register', (req, res) => {
    res.render('register.html', { title });
});

app.get('/login', (req, res) => {
    res.render('login.html', { title });
});

app.all('*', (req, res) => {
    res.status(404).json({
        code: 404,
        error: 'NOT FOUND',
        message: "The resource you are looking for isn't available on this server.",
    });
});

app.listen(PORT, () => {
    console.log(`simple-notes is running at http://${HOST}:${PORT}`);
});
