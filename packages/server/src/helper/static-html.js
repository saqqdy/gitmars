const express = require('express')
const notFind = require('./404')

module.exports = function (path) {
	return [
		express.static(path, {
			maxAge: 0,
			immutable: true
		}),
		notFind
	]
}
