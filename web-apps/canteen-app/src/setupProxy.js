const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/resources',
    createProxyMiddleware({
      target: 'http://localhost:5096',
      changeOrigin: true,
    })
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:7710',
      changeOrigin: true,
    })
  );
  app.use(
    '/json',
    createProxyMiddleware({
      target: 'https://jsonplaceholder.typicode.com',
      changeOrigin: true,
      pathRewrite: {
        '^/json': ''
      }
    })
  );
  app.use(
    '/canteen-ws',
    createProxyMiddleware({
      target: 'http://localhost:7715',
      changeOrigin: true
    })
  );
  app.use(
    '/hottopic/browse/topicList',
    createProxyMiddleware({
      target: 'https://tieba.baidu.com',
      changeOrigin: true
    })
  )
};
