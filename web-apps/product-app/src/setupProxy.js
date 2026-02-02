const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/resources',
        createProxyMiddleware({
            target: 'http://localhost',
            changeOrigin: true,
        })
    );
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost',
            changeOrigin: true,
        })
    );
};
