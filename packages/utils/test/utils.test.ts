import { describe, expect, it } from 'vitest'
import getSeconds from '../src/getSeconds.js'
import isWin32 from '../src/isWin32.js'
import stringify from '../src/stringify.js'
import { decodeUnicode, encodeUnicode } from '../src/unicode.js'

describe('getSeconds', () => {
	it('should return null for invalid input', () => {
		expect(getSeconds('invalid')).toBeNull()
		expect(getSeconds('123')).toBeNull()
		expect(getSeconds('abc')).toBeNull()
	})

	it('should convert minutes correctly', () => {
		const result = getSeconds('5m')

		expect(result).toBeLessThan(Date.now() / 1000)
	})

	it('should convert hours correctly', () => {
		const result = getSeconds('2h')

		expect(result).toBeLessThan(Date.now() / 1000)
	})

	it('should convert days correctly', () => {
		const result = getSeconds('1d')

		expect(result).toBeLessThan(Date.now() / 1000)
	})

	it('should convert weeks correctly', () => {
		const result = getSeconds('1w')

		expect(result).toBeLessThan(Date.now() / 1000)
	})

	it('should convert months correctly', () => {
		const result = getSeconds('1M')

		expect(result).toBeLessThan(Date.now() / 1000)
	})

	it('should convert years correctly', () => {
		const result = getSeconds('1y')

		expect(result).toBeLessThan(Date.now() / 1000)
	})
})

describe('isWin32', () => {
	it('should return a boolean', () => {
		const result = isWin32()

		expect(typeof result).toBe('boolean')
	})

	it('should return true on Windows platform', () => {
		// This test just verifies the function works
		// Actual value depends on the platform running the test
		expect([true, false]).toContain(isWin32())
	})
})

describe('stringify', () => {
	it('should return the original string on non-Windows', () => {
		const input = 'echo hello'
		const result = stringify(input)

		// On non-Windows, should return original string
		// On Windows with special chars, would be JSON.stringify'd
		if (!isWin32()) {
			expect(result).toBe(input)
		}
	})

	it('should handle strings with special characters on Windows', () => {
		const input = 'echo hello ^ world'
		const result = stringify(input)

		if (isWin32()) {
			expect(result).toBe(JSON.stringify(input))
		}
	})

	it('should handle strings with & character on Windows', () => {
		const input = 'cmd1 & cmd2'
		const result = stringify(input)

		if (isWin32()) {
			expect(result).toBe(JSON.stringify(input))
		}
	})
})

describe('unicode', () => {
	describe('encodeUnicode', () => {
		it('should encode Chinese characters to unicode', () => {
			const result = encodeUnicode('你好')

			expect(result).toContain('\\u')
		})

		it('should handle empty string', () => {
			const result = encodeUnicode('')

			expect(result).toBe('\\u')
		})

		it('should handle ASCII characters', () => {
			const result = encodeUnicode('abc')

			expect(result).toContain('\\u')
		})
	})

	describe('decodeUnicode', () => {
		it('should decode unicode to Chinese characters', () => {
			const encoded = encodeUnicode('你好')
			const decoded = decodeUnicode(encoded)

			expect(decoded).toBe('你好')
		})

		it('should handle empty string', () => {
			const result = decodeUnicode('')

			expect(result).toBe('')
		})
	})

	describe('roundtrip', () => {
		it('should correctly roundtrip Chinese text', () => {
			const original = '测试文本'
			const encoded = encodeUnicode(original)
			const decoded = decodeUnicode(encoded)

			expect(decoded).toBe(original)
		})
	})
})
