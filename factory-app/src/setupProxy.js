const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/resources',
        createProxyMiddleware({
            target: 'https://www.cloud77.top',
            changeOrigin: true,
        })
    );
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://www.cloud77.top',
            changeOrigin: true,
        })
    );
    app.use(
        '/identity-app',
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
        '/super-app',
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
        '/factory-app',
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
        '/hottopic/browse/topicList',
        createProxyMiddleware({
            target: 'https://tieba.baidu.com',
            changeOrigin: true
        })
    );
    app.use(
        '/chat-ws',
        createProxyMiddleware({
            target: 'https://www.cloud77.top',
            changeOrigin: true
        }));
};
