# express-mock-creator

`express-mock-creator` 为 express 的 middleware， 能够指定一个目录，遍历此目录下的所有 js 文件做为 mock 数据，提供 mock 服务。支持数据的实时更新，不用重启进程。

参考了 `umi-mock`， 接口文件的配置格式和 umi mock 一致。

## 快速开始

#### 1. 安装依赖
```shell
npm install express express-mock-creator --save-dev
# or use yarn
yarn add express express-mock-creator --dev
```

#### 2. 写 express 服务
```js
const express = require('express');
const path = require('path');
const mockMiddleware = require('express-mock-creator');

const app = express();
// 使用 middleware 指定 mock 目录
app.use(
    mockMiddleware(path.resolve(__dirname, 'mock'))
);

app.listen(3000, () => console.log('Example app listening on port 3000!'));
```

#### 3. 定义 mock 数据
`mock/user.js`：
```js
module.exports = {
  // 支持值为 Object 和 Array
  'GET /api/users': { users: [1, 2] },

  // GET 可以省略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => { res.end('OK'); },
};
```

启动 express 服务后，访问 `http://localhost:3000/api/users` 就能返回数据。修改数据后接口返回会实时更新，无需重启 express。


## 在 create-react-app 创建的项目中使用
在 create-react-app 创建好的项目中加如下文件：
`src/setupProxy.js`: 
```js
const path = require('path');
const mockMiddleware = require('express-mock-creator');

module.exports = app => {
    app.use(mockMiddleware(
        path.resolve(__dirname, '../mock')
    ));
}
```

在项目根目录下建 `mock` 文件夹，文件夹里写 js 文件定义接口数据。`npm run start` 启动服务后，就可以使用接口服务了。