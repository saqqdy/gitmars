const colors = require('colors')

function warning(txt: string): string {
    return colors.yellow(txt)
}
function error(txt: string): string {
    return colors.red(txt)
}
function success(txt: string): string {
    return colors.green(txt)
}

module.exports = {
    warning,
    error,
    success
}
export {}
