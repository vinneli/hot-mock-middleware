const express = require('express');
const path = require('path');
const mockMiddleware = require('hot-mock-middleware');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.use(mockMiddleware(path.resolve(__dirname, 'mock')));

app.listen(3000, () => console.log('Example app listening on port 3000!'));