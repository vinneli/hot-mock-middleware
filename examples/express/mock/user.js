const { delay } = require('roadhog-api-doc');

const proxy =  {
    "/user/info": {
        code: 0,
        message: 'success',
        data: {
            name: 'Sam',
            userid: 1000,
            age: 18,
            city: 'shenzhen'
        }
    },

    "GET /user/list/:page": (req, res) => {
        const data = [];
        for(let i=1; i<=10; i++) {
            data.push({
                name: `name_${i}`,
                userid: 1000 + i,
                age: 18,
                address: 'shenzhen'
            });
        }
        res.send({
            code: 0,
            message: 'success',
            page: req.params.page,
            data,
        });
    },

    "POST /user/update": {
        code: 0,
        message: 'success',
        data: null
    }
}

module.exports = delay(proxy, 100);