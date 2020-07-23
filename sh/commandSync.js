const execa = require('execa');

module.exports = (command, props) => {
	try {
		return execa.sync(command, props);
	} catch (e) {
		return e;
	}
};
