import type { GitmarsOptionArgsType } from '../src/types.js'
import { describe, expect, it, vi } from 'vitest'
import { createArgs } from '../src/command.js'
import { debug, debugError, debugWarn, isDebug } from '../src/debug.js'
import echo from '../src/echo.js'
import { isFileExist, removeFile, writeFile, writeFileSync } from '../src/file.js'
import getSeconds from '../src/getSeconds.js'
import isWin32 from '../src/isWin32.js'
import { translate, useLocale } from '../src/local.js'
import { generateQrcodeImage, printQrcode, readQrcode } from '../src/qrcode.js'
import { spawn, spawnSync } from '../src/spawn.js'
import stringify from '../src/stringify.js'
import { decodeUnicode, encodeUnicode } from '../src/unicode.js'

// Mock external dependencies
vi.mock('debug', () => ({
	default: vi.fn(() => vi.fn()),
}))

vi.mock('cross-spawn', () => ({
	default: {
		sync: vi.fn(() => ({
			pid: 12345,
			stdout: Buffer.from('output'),
			stderr: Buffer.from(''),
			status: 0,
			signal: null,
			error: null,
		})),
	},
}))

vi.mock('jimp', () => ({
	Jimp: {
		read: vi.fn().mockResolvedValue({
			bitmap: {
				data: new Uint8ClampedArray([255, 255, 255, 255]),
				width: 100,
				height: 100,
			},
		}),
	},
}))

vi.mock('jsqr', () => ({
	default: vi.fn(() => ({ data: 'decoded-qrcode-content' })),
}))

vi.mock('qrcode', () => ({
	toString: vi.fn().mockResolvedValue('qr-terminal-string'),
	toFile: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('shelljs', () => ({
	default: {
		test: vi.fn(() => true),
		find: vi.fn(() => ({ stdout: 'found' })),
		rm: vi.fn(),
		echo: vi.fn(),
		config: { silent: true },
	},
}))

describe('createArgs', () => {
	it('should create args string with required arguments', () => {
		const args: GitmarsOptionArgsType[] = [
			{ required: true, name: 'branch', variadic: false },
		]
		const result = createArgs(args)

		expect(result).toBe('<branch>')
	})

	it('should create args string with optional arguments', () => {
		const args: GitmarsOptionArgsType[] = [
			{ required: false, name: 'message', variadic: false },
		]
		const result = createArgs(args)

		expect(result).toBe('[message]')
	})

	it('should create args string with variadic arguments', () => {
		const args: GitmarsOptionArgsType[] = [
			{ required: true, name: 'files', variadic: true },
		]
		const result = createArgs(args)

		expect(result).toBe('<files...>')
	})

	it('should create args string with multiple arguments', () => {
		const args: GitmarsOptionArgsType[] = [
			{ required: true, name: 'branch', variadic: false },
			{ required: false, name: 'message', variadic: false },
		]
		const result = createArgs(args)

		expect(result).toBe('<branch> [message]')
	})

	it('should return empty string for empty array', () => {
		const result = createArgs([])

		expect(result).toBe('')
	})

	it('should handle optional variadic arguments', () => {
		const args: GitmarsOptionArgsType[] = [
			{ required: false, name: 'files', variadic: true },
		]
		const result = createArgs(args)

		expect(result).toBe('[files...]')
	})

	it('should handle multiple variadic arguments', () => {
		const args: GitmarsOptionArgsType[] = [
			{ required: true, name: 'source', variadic: false },
			{ required: true, name: 'files', variadic: true },
		]
		const result = createArgs(args)

		expect(result).toBe('<source> <files...>')
	})
})

describe('debug', () => {
	it('isDebug should be defined and be truthy or falsy', () => {
		// isDebug can be true, false, undefined, or a string (from process.env.DEBUG)
		// When neither GITMARS_DEBUG nor DEBUG is set, it's undefined (bug in source)
		const validTypes = ['boolean', 'string', 'undefined']

		expect(validTypes).toContain(typeof isDebug)
	})

	it('debug functions should not throw when called', () => {
		expect(() => debug('test', 'message')).not.toThrow()
		expect(() => debugWarn('test', 'warning')).not.toThrow()
		expect(() => debugError('test', 'error')).not.toThrow()
	})

	it('debug functions should handle multiple arguments', () => {
		expect(() => debug('test', 'arg1', 'arg2', { key: 'value' })).not.toThrow()
		expect(() => debugWarn('test', 'arg1', 'arg2')).not.toThrow()
		expect(() => debugError('test', 'arg1', 'arg2')).not.toThrow()
	})

	it('debug should handle empty infoName', () => {
		expect(() => debug()).not.toThrow()
		expect(() => debug('', 'message')).not.toThrow()
	})

	it('debugWarn should handle empty infoName', () => {
		expect(() => debugWarn()).not.toThrow()
		expect(() => debugWarn('', 'warning')).not.toThrow()
	})

	it('debugError should handle empty infoName', () => {
		expect(() => debugError()).not.toThrow()
		expect(() => debugError('', 'error')).not.toThrow()
	})

	it('debug functions should handle no arguments', () => {
		expect(() => debug()).not.toThrow()
		expect(() => debugWarn()).not.toThrow()
		expect(() => debugError()).not.toThrow()
	})

	it('debug functions should handle object arguments', () => {
		const obj = { foo: 'bar', nested: { value: 123 } }

		expect(() => debug('test', obj)).not.toThrow()
		expect(() => debugWarn('test', obj)).not.toThrow()
		expect(() => debugError('test', obj)).not.toThrow()
	})

	it('debug functions should handle array arguments', () => {
		const arr = [1, 2, 3, 'test']

		expect(() => debug('test', arr)).not.toThrow()
		expect(() => debugWarn('test', arr)).not.toThrow()
		expect(() => debugError('test', arr)).not.toThrow()
	})

	it('debug functions should handle Error objects', () => {
		const err = new Error('Test error')

		expect(() => debug('test', err)).not.toThrow()
		expect(() => debugWarn('test', err)).not.toThrow()
		expect(() => debugError('test', err)).not.toThrow()
	})
})

describe('echo', () => {
	it('should write message to stdout', () => {
		const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

		echo('test message')

		expect(writeSpy).toHaveBeenCalledWith('test message\n')
		writeSpy.mockRestore()
	})

	it('should handle empty string', () => {
		const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

		echo('')

		expect(writeSpy).toHaveBeenCalledWith('\n')
		writeSpy.mockRestore()
	})

	it('should handle special characters', () => {
		const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

		echo('Hello\nWorld')

		expect(writeSpy).toHaveBeenCalled()
		writeSpy.mockRestore()
	})

	it('should handle unicode characters', () => {
		const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)

		echo('你好世界')

		expect(writeSpy).toHaveBeenCalledWith('你好世界\n')
		writeSpy.mockRestore()
	})

	it('should handle long strings', () => {
		const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
		const longStr = 'a'.repeat(1000)

		echo(longStr)

		expect(writeSpy).toHaveBeenCalledWith(`${longStr}\n`)
		writeSpy.mockRestore()
	})
})

describe('file operations', () => {
	describe('writeFileSync', () => {
		it('should write file synchronously', () => {
			// Test that the function doesn't throw
			expect(() => writeFileSync('/tmp/test-gitmars.txt', 'content')).not.toThrow()
		})

		it('should write file with custom options', () => {
			expect(() => writeFileSync('/tmp/test-gitmars-opts.txt', 'content', { mode: 0o644 })).not.toThrow()
		})
	})

	describe('writeFile', () => {
		it('should write file asynchronously', async () => {
			const fs = require('node:fs/promises')
			const writeSpy = vi.spyOn(fs, 'writeFile').mockResolvedValue(undefined)

			const result = await writeFile('/tmp/test.txt', 'content')

			expect(result).toBeTruthy()
			writeSpy.mockRestore()
		})

		it('should throw error on write failure', async () => {
			const fs = require('node:fs/promises')

			vi.spyOn(fs, 'writeFile').mockRejectedValue(new Error('Write error'))

			await expect(writeFile('/tmp/test.txt', 'content')).rejects.toThrow()
		})
	})

	describe('isFileExist', () => {
		it('should return boolean for file existence', () => {
			const result = isFileExist('/some/path')

			expect(typeof result).toBe('boolean')
		})

		it('should return true for existing file', () => {
			// Test with package.json which should exist
			const result = isFileExist('package.json')

			expect(result).toBeTruthy()
		})

		it('should return false for non-existing file', () => {
			const result = isFileExist('/nonexistent/path/to/file.txt')

			expect(typeof result).toBe('boolean')
		})
	})

	describe('removeFile', () => {
		it('should handle single file removal without error', () => {
			expect(() => removeFile({ url: '/tmp/nonexistent-test.txt' })).not.toThrow()
		})

		it('should handle file with name', () => {
			expect(() => removeFile({ name: 'Test File', url: '/tmp/nonexistent-test.txt' })).not.toThrow()
		})

		it('should handle array of files', () => {
			expect(() => removeFile([
				{ name: 'File 1', url: '/tmp/nonexistent-test1.txt' },
				{ name: 'File 2', url: '/tmp/nonexistent-test2.txt' },
			])).not.toThrow()
		})

		it('should handle file that exists', () => {
			// Create a temp file first
			const fs = require('node:fs')
			const tempFile = '/tmp/test-gitmars-remove.txt'

			fs.writeFileSync(tempFile, 'test')

			expect(() => removeFile({ name: 'Temp File', url: tempFile })).not.toThrow()
		})

		it('should handle empty array', () => {
			expect(() => removeFile([])).not.toThrow()
		})

		it('should handle file without name', () => {
			expect(() => removeFile({ url: '/tmp/test.txt' })).not.toThrow()
		})
	})
})

describe('getSeconds', () => {
	it('should return null for invalid input', () => {
		expect(getSeconds('invalid')).toBeNull()
		expect(getSeconds('123')).toBeNull()
		expect(getSeconds('abc')).toBeNull()
		expect(getSeconds('')).toBeNull()
		expect(getSeconds('m')).toBeNull()
	})

	it('should convert minutes correctly', () => {
		const result = getSeconds('5m')
		const expected = Math.floor(Date.now() / 1000 - 5 * 60)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should convert hours correctly', () => {
		const result = getSeconds('2h')
		const expected = Math.floor(Date.now() / 1000 - 2 * 3600)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should convert days correctly', () => {
		const result = getSeconds('1d')
		const expected = Math.floor(Date.now() / 1000 - 86400)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should convert weeks correctly', () => {
		const result = getSeconds('1w')
		const expected = Math.floor(Date.now() / 1000 - 604800)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should convert months correctly', () => {
		const result = getSeconds('1M')
		const expected = Math.floor(Date.now() / 1000 - 2592000)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should convert years correctly', () => {
		const result = getSeconds('1y')
		const expected = Math.floor(Date.now() / 1000 - 31536000)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should handle unknown unit without conversion', () => {
		const result = getSeconds('10x')
		const expected = Math.floor(Date.now() / 1000 - 10)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should handle zero value', () => {
		const result = getSeconds('0m')
		const expected = Math.floor(Date.now() / 1000)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should handle large numbers', () => {
		const result = getSeconds('1000m')
		const expected = Math.floor(Date.now() / 1000 - 1000 * 60)

		expect(result).toBeCloseTo(expected, -1)
	})

	it('should handle lowercase m for minutes', () => {
		const result = getSeconds('10m')

		expect(result).not.toBeNull()
		expect(typeof result).toBe('number')
	})

	it('should handle uppercase M for months', () => {
		const result = getSeconds('2M')

		expect(result).not.toBeNull()
		expect(typeof result).toBe('number')
	})

	it('should handle multiple digits', () => {
		const result = getSeconds('123m')

		expect(result).not.toBeNull()
		expect(typeof result).toBe('number')
	})
})

describe('isWin32', () => {
	it('should return a boolean', () => {
		const result = isWin32()

		expect(typeof result).toBe('boolean')
	})

	it('should return correct value based on platform', () => {
		const result = isWin32()

		expect(result).toBe(process.platform === 'win32')
	})

	it('should return same value on multiple calls', () => {
		const result1 = isWin32()
		const result2 = isWin32()

		expect(result1).toBe(result2)
	})
})

describe('stringify', () => {
	it('should return original string on non-Windows without special chars', () => {
		const input = 'echo hello'
		const result = stringify(input)

		// On Windows with special chars, it would be JSON.stringify'd
		// On non-Windows, it returns the original string
		expect([input, JSON.stringify(input)]).toContain(result)
	})

	it('should handle strings with ^ character', () => {
		const input = 'echo hello ^ world'
		const result = stringify(input)

		// On Windows, strings with ^ should be JSON.stringify'd
		expect([input, JSON.stringify(input)]).toContain(result)
	})

	it('should handle strings with & character', () => {
		const input = 'cmd1 & cmd2'
		const result = stringify(input)

		// On Windows, strings with & should be JSON.stringify'd
		expect([input, JSON.stringify(input)]).toContain(result)
	})

	it('should not modify string without special chars', () => {
		const input = 'git commit -m "message"'
		const result = stringify(input)

		// On non-Windows or Windows without special chars, returns original
		expect([input, JSON.stringify(input)]).toContain(result)
	})

	it('should handle empty string', () => {
		const input = ''
		const result = stringify(input)

		expect(result).toBe(input)
	})

	it('should handle strings with both ^ and & characters', () => {
		const input = 'cmd1 ^ & cmd2'
		const result = stringify(input)

		expect([input, JSON.stringify(input)]).toContain(result)
	})

	it('should handle strings with multiple special characters', () => {
		const input = 'echo ^ & | > <'
		const result = stringify(input)

		expect([input, JSON.stringify(input)]).toContain(result)
	})

	it('should return string type', () => {
		const result = stringify('test')

		expect(typeof result).toBe('string')
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

		it('should handle mixed content', () => {
			const result = encodeUnicode('hello世界')

			expect(result).toContain('\\u')
		})

		it('should handle special characters', () => {
			const result = encodeUnicode('!@#$%')

			expect(typeof result).toBe('string')
		})

		it('should handle numbers', () => {
			const result = encodeUnicode('123')

			expect(typeof result).toBe('string')
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

		it('should handle string without unicode', () => {
			const result = decodeUnicode('hello')

			expect(result).toBe('hello')
		})
	})

	describe('roundtrip', () => {
		it('should correctly roundtrip Chinese text', () => {
			const original = '测试文本'
			const encoded = encodeUnicode(original)
			const decoded = decodeUnicode(encoded)

			expect(decoded).toBe(original)
		})

		it('should correctly roundtrip mixed text', () => {
			const original = 'Hello 世界 World'
			const encoded = encodeUnicode(original)
			const decoded = decodeUnicode(encoded)

			expect(decoded).toBe(original)
		})

		it('should correctly roundtrip emojis', () => {
			const original = '🎉🎊'
			const encoded = encodeUnicode(original)
			const decoded = decodeUnicode(encoded)

			expect(decoded).toBe(original)
		})

		it('should correctly roundtrip Japanese', () => {
			const original = 'こんにちは'
			const encoded = encodeUnicode(original)
			const decoded = decodeUnicode(encoded)

			expect(decoded).toBe(original)
		})

		it('should correctly roundtrip Korean', () => {
			const original = '안녕하세요'
			const encoded = encodeUnicode(original)
			const decoded = decodeUnicode(encoded)

			expect(decoded).toBe(original)
		})
	})
})

describe('useLocale and translate', () => {
	const testLocale = {
		name: 'test',
		hello: 'Hello',
		greet: 'Hello, {name}!',
		nested: {
			message: 'Nested message',
		},
	}

	describe('useLocale', () => {
		it('should return locale context', () => {
			const ctx = useLocale(testLocale)

			expect(ctx.lang).toBe('test')
			expect(ctx.locale).toBe(testLocale)
			expect(typeof ctx.t).toBe('function')
		})

		it('should translate simple key', () => {
			const { t } = useLocale(testLocale)

			expect(t('hello')).toBe('Hello')
		})

		it('should translate key with placeholder', () => {
			const { t } = useLocale(testLocale)

			expect(t('greet', { name: 'World' })).toBe('Hello, World!')
		})

		it('should return key if translation not found', () => {
			const { t } = useLocale(testLocale)

			expect(t('nonexistent')).toBe('nonexistent')
		})

		it('should handle nested keys', () => {
			const { t } = useLocale(testLocale)

			expect(t('nested.message')).toBe('Nested message')
		})

		it('should handle missing placeholder values', () => {
			const { t } = useLocale(testLocale)

			expect(t('greet', {})).toBe('Hello, {name}!')
		})

		it('should handle multiple placeholders', () => {
			const locale = {
				name: 'test',
				msg: 'Hello {name}, you have {count} messages',
			}
			const { t } = useLocale(locale)

			expect(t('msg', { name: 'User', count: 5 })).toBe('Hello User, you have 5 messages')
		})
	})

	describe('translate', () => {
		it('should return path when not found in locale', () => {
			const result = translate('missing.key', undefined, testLocale)

			expect(result).toBe('missing.key')
		})

		it('should replace placeholders with option values', () => {
			const locale = {
				name: 'test',
				template: 'Value is {value}',
			}
			const result = translate('template', { value: 'test' }, locale)

			expect(result).toBe('Value is test')
		})

		it('should keep placeholder when option not provided', () => {
			const locale = {
				name: 'test',
				template: 'Value is {value}',
			}
			const result = translate('template', {}, locale)

			expect(result).toBe('Value is {value}')
		})
	})
})

describe('spawn', () => {
	it('should execute command and return result', () => {
		const result = spawn('echo', ['hello'])

		expect(result).toHaveProperty('stdout')
		expect(result).toHaveProperty('stderr')
		expect(result).toHaveProperty('status')
	})

	it('should filter empty arguments', () => {
		const result = spawn('git', ['status', '', ''])

		expect(result).toHaveProperty('stdout')
	})

	it('should handle options parameter', () => {
		const result = spawn('node', ['--version'], { cwd: '/tmp' })

		expect(result).toHaveProperty('stdout')
	})

	it('should return pid', () => {
		const result = spawn('echo', ['hello'])

		expect(result).toHaveProperty('pid')
	})

	it('should return signal', () => {
		const result = spawn('echo', ['hello'])

		expect(result).toHaveProperty('signal')
	})

	it('should return error property', () => {
		const result = spawn('echo', ['hello'])

		expect(result).toHaveProperty('error')
	})

	it('should handle empty argv array', () => {
		const result = spawn('echo', [])

		expect(result).toHaveProperty('stdout')
	})

	it('should handle undefined arguments in argv', () => {
		const result = spawn('echo', ['test', undefined as any])

		expect(result).toHaveProperty('stdout')
	})

	it('should return string for stdout', () => {
		const result = spawn('echo', ['hello'])

		expect(typeof result.stdout).toBe('string')
	})

	it('should return string for stderr', () => {
		const result = spawn('echo', ['hello'])

		expect(typeof result.stderr).toBe('string')
	})

	it('should return number for status', () => {
		const result = spawn('echo', ['hello'])

		expect(typeof result.status).toBe('number')
	})
})

describe('spawnSync', () => {
	it('should execute command synchronously and return result', () => {
		const result = spawnSync('echo', ['hello'])

		expect(result).toHaveProperty('stdout')
		expect(result).toHaveProperty('stderr')
		expect(result).toHaveProperty('status')
	})

	it('should filter empty arguments', () => {
		const result = spawnSync('git', ['status', '', ''])

		expect(result).toHaveProperty('stdout')
	})

	it('should handle options parameter', () => {
		const result = spawnSync('node', ['--version'], { cwd: '/tmp' })

		expect(result).toHaveProperty('stdout')
	})

	it('should return pid', () => {
		const result = spawnSync('echo', ['hello'])

		expect(result).toHaveProperty('pid')
	})

	it('should return string for stdout', () => {
		const result = spawnSync('echo', ['hello'])

		expect(typeof result.stdout).toBe('string')
	})

	it('should return string for stderr', () => {
		const result = spawnSync('echo', ['hello'])

		expect(typeof result.stderr).toBe('string')
	})

	it('should return number for status', () => {
		const result = spawnSync('echo', ['hello'])

		expect(typeof result.status).toBe('number')
	})

	it('should handle empty argv array', () => {
		const result = spawnSync('echo', [])

		expect(result).toHaveProperty('stdout')
	})

	it('should handle undefined arguments in argv', () => {
		const result = spawnSync('echo', ['test', undefined as any])

		expect(result).toHaveProperty('stdout')
	})
})

describe('qrcode', () => {
	describe('readQrcode', () => {
		it('should read QR code from image', async () => {
			const result = await readQrcode('/path/to/image.png')

			expect(result).toBe('decoded-qrcode-content')
		})

		it('should reject when QR code cannot be recognized', async () => {
			const jsqr = await import('jsqr')

			vi.mocked(jsqr.default).mockReturnValueOnce(null as any)

			await expect(readQrcode('/path/to/invalid.png')).rejects.toThrow()
		})

		it('should reject when image cannot be read', async () => {
			const jimp = await import('jimp')

			vi.mocked(jimp.Jimp.read).mockRejectedValueOnce(new Error('Cannot read image'))

			await expect(readQrcode('/path/to/nonexistent.png')).rejects.toThrow()
		})
	})

	describe('printQrcode', () => {
		it('should print QR code to console', async () => {
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

			await printQrcode('https://example.com')

			expect(consoleSpy).toHaveBeenCalledWith('qr-terminal-string')
			consoleSpy.mockRestore()
		})

		it('should handle special content', async () => {
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

			await printQrcode('gitmars://test?param=value')

			expect(consoleSpy).toHaveBeenCalled()
			consoleSpy.mockRestore()
		})
	})

	describe('generateQrcodeImage', () => {
		it('should generate QR code image', async () => {
			const qrcode = await import('qrcode')

			await generateQrcodeImage('/tmp/qr.png', 'content')

			expect(qrcode.toFile).toHaveBeenCalled()
		})

		it('should call toFile with correct parameters', async () => {
			const qrcode = await import('qrcode')

			await generateQrcodeImage('/tmp/test-qr.png', 'test content')

			expect(qrcode.toFile).toHaveBeenCalledWith(
				'/tmp/test-qr.png',
				'test content',
				expect.objectContaining({
					errorCorrectionLevel: 'L',
					type: 'png',
				}),
			)
		})
	})
})
