const express = require('express')

module.exports = function (path) {
	return [
		express.static(path, {
			maxAge: 0,
			immutable: true,
			setHeaders: function (res, path) {
				res.set('x-timestamp', Date.now())
				if (path.substr(-5) === '.html')
					res.set(
						'Cache-Control',
						'public, max-age=0, s-maxage=0, immutable, must-revalidate'
					)
				else
					res.set(
						'Cache-Control',
						'public, max-age=0, s-maxage=0, immutable'
					)
			}
		})
	]
}
