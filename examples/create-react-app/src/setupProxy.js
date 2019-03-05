const path = require('path');
const mockMiddleware = require('../../../index.js');

module.exports = app => {
    app.use(mockMiddleware(
        path.resolve(__dirname, '../mock')
    ));
}