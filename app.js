const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

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
