const fs = require('fs');
const path = require('path');
const colors = require('colors');
const cwd = process.cwd();
const pkg = fs.readFileSync(path.join(cwd, 'package.json'));
const commandSync = require(path.join(cwd, 'bin/commandSync'));
const version = JSON.parse(pkg).version;
const argvs = process.argv.slice(2);
if (!version) {
	process.exit(0);
}
let line = commandSync('git', ['symbolic-ref', '--short', '-q', 'HEAD']).stdout;
if (argvs.includes('--deploy') && line !== 'master') {
	console.log(colors.yellow('请在master分支下执行'));
	process.exit(0);
}
if (argvs.length === 0 && !argvs.includes('--deploy')) {
	console.log(colors.yellow('请输入提交信息'));
	process.exit(0);
}
commandSync('git', ['fetch', 'origin', '--tags']);
commandSync('git', ['add', '.']);
commandSync('git', ['commit', '-m', argvs.includes('--deploy') ? `"feature: publish version ${version}"` : argvs.length > 0 ? argvs[0] : 'feature: push some changes']);
commandSync('git', ['push']);
console.log(colors.green('推送成功！'));
if (argvs.includes('--deploy')) {
	let id = commandSync('git', ['rev-list', '--tags', '--max-count', '1']).stdout,
		latest = commandSync('git', ['describe', '--tags', id]).stdout;
	if (latest === version) {
		console.log(colors.red('当前版本已存在，请更改package.json里面的version之后再执行'));
		process.exit(0);
	}
	// commandSync('git', ['tag', version]);
	// commandSync('git', ['push', 'origin', version]);
	// commandSync('git', ['tag', '-d', version]);
	console.log(colors.green('v' + version + '发版已完成，请进入git同步地铁线构建一次'));
}
