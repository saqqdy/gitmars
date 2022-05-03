// getIsUpdatedInTime({ lastet: '7d', limit: 100, branch: '' })

// const sh = require('shelljs')

// console.log(
//     sh.exec(
//         `git rev-parse --verify 921092dcd62c781a6cfa78c76a4f4bc6f36226ca1`,
//         {
//             silent: true
//         }
//     ).code
// )

// console.log(
//     sh.exec(`git branch --format="%(refname:short)" --contains lite`, {
//         silent: true
//     })
// )

// const home = require('./app/lib/home')()

// const glob = require('@gitmars/core/utils/echo')
import glob from '@gitmars/core/es/utils/echo'
console.log(glob)

// console.log(home({lastet:'7d', limit: 100, branch:'master'}))

// var parser = require('cron-parser')

// try {
//     var interval = parser.parseExpression('0 0 6 ? * SAT')

//     console.log('Date: ', interval.next().toString())
//     console.log('Date: ', interval.next().toString())
//     console.log('Date: ', interval.next().toString())
//     console.log('Date: ', interval.next().toString())

//     //   console.log('Date: ', interval.prev().toString());
//     //   console.log('Date: ', interval.prev().toString());
// } catch (err) {
//     console.log('Error: ' + err.message)
// }

