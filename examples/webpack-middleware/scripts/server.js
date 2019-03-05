#!/usr/bin/env node

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const mockMiddleware = require('../../../index.js');
const config = require('../webpack.config.js');

const app = express();
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
    contentBase: path.resolve(__dirname, '../dist'),
    open: true
}));

app.use(mockMiddleware(
    path.resolve(__dirname, '../mock')
));

app.listen(3000, function () {
    console.log('dev server listening on port 3000');
});
