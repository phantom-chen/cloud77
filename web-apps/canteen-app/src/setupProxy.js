const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/resources',
    createProxyMiddleware({
      target: 'https://www.cloud77.top',
      changeOrigin: true,
    })
  );
  // app.use(
  //   '/api',
  //   createProxyMiddleware({
  //     target: 'http://localhost:5648',
  //     changeOrigin: true,
  //   })
  // );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://www.cloud77.top',
      changeOrigin: true,
    })
  );
  app.use(
    '/user-app',
    createProxyMiddleware({
      target: 'https://www.cloud77.top',
      changeOrigin: true,
    })
  );
  app.use(
    '/canteen-app',
    createProxyMiddleware({
      target: 'https://www.cloud77.top',
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
      target: 'http://localhost:5648',
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
