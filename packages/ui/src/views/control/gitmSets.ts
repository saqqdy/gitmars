// const commandSets = require.context('gitmars/lib/conf', false, /(([A-Za-z]\w+)|index)\.(json|js)$/)
const commandSets = import.meta.glob('/Users/saqqdy/www/saqqdy/gitmars/packages/gitmars/lib/conf/*.js', { eager: true })
let sets = {}

for (const key in commandSets) {
    const name = key.replace(/^.+\/(\w+)\.js$/, '$1')
    if (Object.keys(commandSets[key]).length) {
        // @ts-expect-error
        sets[name] = commandSets[key]
    } else {
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
// const commandSets = requireAll(require.context('gitmars/lib/conf', false, /(([A-Za-z]\w+)|index)\.(json|js)$/))

export default sets
