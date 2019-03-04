#!/usr/bin/env node

const webpack = require('webpack');
const config = require('../webpack.config.js');

const compiler = webpack(config);
compiler.run((err, stats) => {
    if(!err) {
        console.log('build success');
    } else {
        console.log(err);
    }
});