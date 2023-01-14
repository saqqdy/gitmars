/**
 * compareVersion版本号大小对比
 *
 * @param basicVer - 必传 版本号
 * @param compareVer - 必传 需要对比的版本号
 * @return isNew - null/true/false
 */
function compareVersion(basicVer: string, compareVer: string): boolean | null {
	if (basicVer === null) return null
	basicVer = basicVer + '.'
	compareVer = compareVer + '.'
	const bStr = parseFloat(basicVer)
	const cStr = parseFloat(compareVer)
	const bStrNext = parseFloat(basicVer.replace(bStr + '.', '')) || 0
	const cStrNext = parseFloat(compareVer.replace(cStr + '.', '')) || 0
	if (cStr > bStr) {
		return false
	} else if (cStr < bStr) {
		return true
	} else {
		if (bStrNext >= cStrNext) {
			return true
		} else {
			return false
		}
	}
}

export default compareVersion
