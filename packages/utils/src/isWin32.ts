/**
 * is it running in windows
 *
 * @returns result - Return boolean
 */
export default function isWin32(): boolean {
	return process.platform === 'win32'
}
