const colors = require('colors')

export function warning(txt: string): string {
    return colors.yellow(txt)
}
export function error(txt: string): string {
    return colors.red(txt)
}
export function success(txt: string): string {
    return colors.green(txt)
}
