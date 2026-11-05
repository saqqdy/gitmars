/**
 * Convert a duration string to seconds
 *
 * @param str - Time string
 * @returns seconds - Time in seconds
 */
function getSeconds(str: string): number | null {
	const match = String(str).match(/^(\d+)([a-zA-Z]+)$/)
	let time

	if (!match) return null
	time = +match[1]
	switch (match[2]) {
		case 'm':
			time *= 60
			break
		case 'h':
			time *= 3600
			break
		case 'd':
			time *= 86400
			break
		case 'w':
			time *= 604800
			break
		case 'M':
			time *= 2592000
			break
		case 'y':
			time *= 31536000
			break
		default:
			break
	}

	return Number.parseInt(String(Date.now() / 1000 - time))
}

export default getSeconds
