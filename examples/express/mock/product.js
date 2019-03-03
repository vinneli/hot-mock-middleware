const { delay } = require('roadhog-api-doc');

const proxy =  {
    "/product/detail/:id": (req, res) => {
        res.json({
            code: 0,
            message: 'success',
            data: {
                id: req.params.id,
                name: 'iPhone X',
                price: 7999,
            }
        });
    },

    "POST /product/update": {
        code: 0,
        message: 'success',
        data: null
    }
}

module.exports = delay(proxy, 100);