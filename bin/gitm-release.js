const program = require('./gitm')
const shell = require('shelljs')
console.log('release.js')
program
  .command('test')
  .option('--no-sauce', 'Remove sauce')
  .option(
    '--sa [sa]',
    'Remove sauce',
    (val, pre) => {
      console.log('---', val, pre)
      return val + '444'
    },
    12
  )
  .option('--cheese [flavour]', 'cheese flavour', 'mozzarella')
  .option('--no-cheese', 'plain with no cheese')
  .action((opts) => {
    console.log(opts.sauce, opts.sa, opts.cheese)
  })
program.parse(process.argv)
