'use strict'
var os = require('os')

function homedir() {
	var env = process.env as any,
		home = env.HOME,
		user = env.LOGNAME || env.USER || env.LNAME || env.USERNAME
	if (process.platform === 'win32') {
		return env.USERPROFILE || env.HOMEDRIVE + env.HOMEPATH || home || null
	}
	if (process.platform === 'darwin') {
		return home || (user ? '/Users/' + user : null)
	}
	if (process.platform === 'linux') {
		if (home) return home
		else if (process.getuid() === 0) return '/root'
		else if (user) return '/home/' + user
		return null
	}
	return home || null
}

module.exports = typeof os.homedir === 'function' ? os.homedir : homedir
export {}
