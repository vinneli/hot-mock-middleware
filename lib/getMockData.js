const bodyParser = require('body-parser');
const assert = require('assert');
const pathToRegexp = require('path-to-regexp');
const multer = require('multer');
const path = require('path');
const signale = require('signale');
const glob = require('glob');

const VALID_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const BODY_PARSED_METHODS = ['post', 'put', 'patch', 'delete'];

function createHandler(handler, parseBody = false) {
  return function(req, res, next) {
    if (parseBody) {
      bodyParser.json({ limit: '5mb', strict: false })(req, res, () => {
        bodyParser.urlencoded({ limit: '5mb', extended: true })(
          req,
          res,
          () => {
            sendData();
          },
        );
      });
    } else {
      sendData();
    }

    function sendData() {
      if (typeof handler === 'function') {
        multer().any()(req, res, () => {
          handler(req, res, next);
        });
      } else {
        res.json(handler);
      }
    }
  };
}

function normalizeConfig(config) {
  return Object.keys(config).reduce((memo, key) => {
    const handler = config[key];
    const type = typeof handler;
    assert(
      type === 'function' || type === 'object',
      `mock value of ${key} should be function or object, but got ${type}`,
    );
    const { method, path } = parseKey(key);
    const keys = [];
    const re = pathToRegexp(path, keys);
    memo.push({
      method,
      path,
      re,
      keys,
      handler: createHandler(handler, BODY_PARSED_METHODS.includes(method)),
    });
    return memo;
  }, []);
}

function parseKey(key) {
  let method = 'get';
  let path = key;
  if (key.indexOf(' ') > -1) {
    const splited = key.split(/\s+/);
    method = splited[0].toLowerCase();
    path = splited[1]; // eslint-disable-line
  }
  assert(
    VALID_METHODS.includes(method),
    `Invalid method ${method} for path ${path}, please check your mock files.`,
  );
  return {
    method,
    path,
  };
}

function getMockFiles({ targetDir, ignore=[] }) {
  let mockFiles = glob
    .sync('**/*.js', {
      cwd: targetDir,
      ignore,
    })
    .map(file => path.join(targetDir, file));
  return mockFiles;
}


function getMockConfigFromFiles(files) {
  return files.reduce((memo, mockFile) => {
    try {
      const m = require(mockFile); // eslint-disable-line
      memo = {
        ...memo,
        ...(m.default || m),
      };
      return memo;
    } catch (e) {
      throw new Error(e.stack);
    }
  }, {});
}


module.exports = ({ targetDir, ignore, onError = ()=>{} }) => {
  try {
    const files = getMockFiles({ targetDir, ignore });
    console.log('mock files:');
    console.log(files.join("\n"));
    const mockData = getMockConfigFromFiles(files);
    return normalizeConfig(mockData);
  } catch (e) {
    onError(e);
    signale.error(e);
  }
}