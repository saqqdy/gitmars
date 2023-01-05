import isWin32 from '#lib/utils/isWin32'

const NEED_STRINGIFY: string[] = ['^', '&']

/**
 * Handle characters in commands that need to be escaped for windows, such as: ^, &
 *
 * @param str - input string
 * @returns code - Return string
 */
export default function stringify(str: string): string {
    if (isWin32() && NEED_STRINGIFY.some(item => str.includes(item))) {
        return JSON.stringify(str)
    }
    return str
}
