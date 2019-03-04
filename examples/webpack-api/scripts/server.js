#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const mockMiddleware = require('../../../index.js');
const config = require('../webpack.config.js');

const options = {
    contentBase: path.resolve(__dirname, '../dist'),
    // 这样使用也可以
    // before(app) {
    //     app.use(mockMiddleware(
    //         path.resolve(__dirname, '../mock'))
    //     );
    // }
};
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.use(mockMiddleware(
    path.resolve(__dirname, '../mock')
));

server.listen(3000, 'localhost', () => {
    console.log('dev server listening on port 3000');
});