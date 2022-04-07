// const commandSets = require.context('gitmLib/conf', false, /(([A-Za-z]\w+)|index)\.(json|js)$/)
const commandSets = import.meta.globEager('../../../../lib/conf/*.js')
let sets = {}

for (const key in commandSets) {
    const name = key.replace(/^.+\/(\w+)\.js$/, '$1')
    if (Object.keys(commandSets[key]).length) {
        // @ts-ignore
        sets[name] = commandSets[key]
    } else {
        // @ts-ignore
        sets = (window as any).gitmarsCmdConfig
        break
    }
}
// for (const path in require.cache) {
// 	if (path.endsWith('combine.js')) {
// 		// only clear *.js, not *.node
// 		console.log(path)
// 		delete require.cache[path]
// 	}
// }
// const requireAll = context => context.keys().map(context)
// const commandSets = requireAll(require.context('gitmLib/conf', false, /(([A-Za-z]\w+)|index)\.(json|js)$/))

export default sets
