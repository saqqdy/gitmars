const colors = require('colors')

function warning(txt) {
    return colors.yellow(txt)
}
function error(txt) {
    return colors.red(txt)
}
function success(txt) {
    return colors.green(txt)
}

/**
 * writeFile
 * @description 写文件
 */
function writeFile(url, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(url, data, err => {
            if (err) {
                reject(new Error('文件写入错误'))
            } else {
                resolve()
            }
        })
    })
}

/**
 * createArgs
 * @description 生成参数
 */
function createArgs(args) {
    let argArr = []
    args.forEach(arg => {
        let str = arg.name
        if (arg.variadic) str += '...'
        if (arg.required) str = '<' + str + '>'
        else str = '[' + str + ']'
        argArr.push(str)
    })
    return argArr.join(' ')
}

module.exports = {
    warning,
    error,
    success,
    writeFile,
    createArgs
}
