const {createProxyMiddleware} = require('http-proxy-middleware');

// Purely for development purposes, this is disregarded during deployment
module.exports = function(app) {
    app.use('/api', createProxyMiddleware({target: 'http://localhost:5000', changeOrigin: true}))
}