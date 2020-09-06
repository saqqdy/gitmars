const commandSets = require.context('gitmLib/conf', false, /(([A-Za-z]\w+)|index)\.(json|js)$/)
let sets = {}
// for (const path in require.cache) {
// 	if (path.endsWith('combine.js')) {
// 		// only clear *.js, not *.node
// 		console.log(path)
// 		delete require.cache[path]
// 	}
// }
for (let key of commandSets.keys()) {
	let name = key.replace(/\/index\.\w+$/, '').replace(/^\.\/(.*)\.\w+$/, '$1')
	sets[name] = commandSets(key)
}

// const requireAll = context => context.keys().map(context)
// const commandSets = requireAll(require.context('gitmLib/conf', false, /(([A-Za-z]\w+)|index)\.(json|js)$/))

export default sets
