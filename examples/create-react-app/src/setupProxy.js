const path = require('path');
const mockMiddleware = require('hot-mock-middleware');

module.exports = app => {
    app.use(mockMiddleware(
        path.resolve(__dirname, '../mock')
    ));
}