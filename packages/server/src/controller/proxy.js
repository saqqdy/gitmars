const { createProxyMiddleware } = require('http-proxy-middleware')
const config = require('../../config')
const logger = require(config.path.logger).getLogger('website')

function fallback() {
	return createProxyMiddleware({
		target: config.api,
		changeOrigin: true,
		pathRewrite: {
			'^/java/': '/',
			'^/h5/': '/',
			'^/ios/': '/',
			'^/android/': '/'
		},
		onError: (err, req, res) => {
			logger.error(err)
			res.render('error', {
				title: err.status || 500,
				err
			})
		}
	})
}

function api() {
	return createProxyMiddleware({
		target: config.api,
		changeOrigin: true,
		onError: (err, req, res) => {
			logger.error(err)
			res.render('error', {
				title: err.status || 500,
				err
			})
		}
	})
}

module.exports = {
	fallback,
	api
}
