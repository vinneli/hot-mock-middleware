function decodeParam(val) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param ' ${val} '`;
      err.status = 400;
      err.statusCode = 400;
    }
    throw err;
  }
}

module.exports = (req, mockData) => {
  const { path: targetPath, method } = req;
  const targetMethod = method.toLowerCase();

  for (const mock of mockData) {
    const { method, re, keys } = mock;
    if (method === targetMethod) {
      const match = re.exec(targetPath);
      if (match) {
        // 解析 url 里的动态参数，比如 `/user/:name`，解析的值存入 req.params 里，类似 express
        // 这里的 url 并不会传给 express 处理，所以动态参数要自己解析
        const params = {};
        for (let i = 1; i < match.length; i += 1) {
          const key = keys[i - 1];
          const prop = key.name;
          const val = decodeParam(match[i]);
          if (val !== undefined || !hasOwnProperty.call(params, prop)) {
            params[prop] = val;
          }
        }
        req.params = params;
        return mock;
      }
    }
  }
}
