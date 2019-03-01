const path = require('path');
const chokidar = require('chokidar');
const signale = require('signale');
const matchMock = require('./matchMock');
const getMockData = require('./getMockData');

module.exports = ({ dir, ignore=[] }) => {
  const targetDir = path.resolve(dir);
  let mockData = null;
  let errors = [];

  fetchMockData();

  const watcher = chokidar.watch(targetDir, { ignoreInitial:true });
  watcher.on('all', (event, file) => {
    console.log(`[${event}] ${file}, reload mock data`);
    errors = [];
    cleanRequireCache();
    fetchMockData();
    if (!errors.length) {
      signale.success(`Mock files parse success`);
    }
  });

  function cleanRequireCache() {
    Object.keys(require.cache).forEach(file => {
      if(file.indexOf(targetDir) > -1) {
        delete require.cache[file];
      }
    });
  }

  function fetchMockData() {
    mockData = getMockData({
      targetDir,
      ignore,
      onError(e) {
        errors.push(e);
      }
    });
  }

  return (req, res, next) => {
    const match = mockData && matchMock(req, mockData);
    if (match) {
      console.log(`mock matched: [${match.method}] ${match.path}`);
      return match.handler(req, res, next);
    } else {
      return next();
    }
  };
}
