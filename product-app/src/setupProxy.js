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
};
