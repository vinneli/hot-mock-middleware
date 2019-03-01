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

export default function(req, mockData) {
  const { path: targetPath, method } = req;
  const targetMethod = method.toLowerCase();

  for (const mock of mockData) {
    const { method, re, keys } = mock;
    // NOTE: 如果 mathod 和 路由正则都能匹配，则返回此 mock 数据
    if (method === targetMethod) {
      const match = re.exec(targetPath);
      if (match) {
        // NOTE: 比如，解析地址里的 `/user/:name`，req.params 里存入 name 值： req.params['name'] = xxx
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
