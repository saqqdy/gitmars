// 获取cookie
export function getCookie(name) {
	var arr,
		reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
	arr = document.cookie.match(reg)
	if (arr) {
		return decodeURIComponent(arr[2])
	} else {
		return null
	}
}

// 设置cookies
export function setCookie(name, value, day) {
	var exp = new Date()
	day = day || 1
	exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000)
	document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString() + ';path=/'
}

/**
 * @module Common
 * @export getSession
 * @description 获取缓存，存入的如果是Object，取出的也是Object，不需要再转换
 * @param name {String} 缓存名称
 * @returns value 返回数据，存的如果是对象，取出的也是对象
 */
export function getSession(name) {
	let str = sessionStorage.getItem(name),
		exp = new Date(),
		o
	if (str) {
		try {
			o = JSON.parse(str)
		} catch (err) {
			o = str
		}
		if (typeof o !== 'object') return o
		if (!o.value) return null
		if (!o.expires || o.expires > exp.getTime()) {
			return o.value
		}
		sessionStorage.removeItem(name)
		return null
	}
	return null
}
/**
 * @module Common
 * @export setSession
 * @description 获取缓存，存入的如果是Object，取出的也是Object，不需要再转换
 * @param name {String} 缓存名称
 * @param value {String, Boolean, Number, Object} 缓存数据，可以直接传入Object
 * @param seconds {Number} 缓存时间（秒）
 * @returns value 返回数据，存的如果是对象，取出的也是对象
 */
export function setSession(name, value, seconds) {
	let e = new Date(),
		expires = seconds ? e.getTime() + seconds * 1000 : '',
		o = {}
	o.value = value
	o.expires = expires
	o = JSON.stringify(o)
	sessionStorage.setItem(name, o)
}

/**
 * @module Common
 * @export getCache
 * @description 获取缓存，存入的如果是Object，取出的也是Object，不需要再转换
 * @param name {String} 缓存名称
 * @returns value 返回数据，存的如果是对象，取出的也是对象
 */
export function getCache(name) {
	let str = localStorage.getItem(name),
		exp = new Date(),
		o
	if (str) {
		try {
			o = JSON.parse(str)
		} catch (err) {
			o = str
		}
		if (typeof o !== 'object') return o
		if (!o.value) return null
		if (!o.expires || o.expires > exp.getTime()) {
			return o.value
		}
		localStorage.removeItem(name)
		return null
	}
	return null
}
/**
 * @module Common
 * @export setCache
 * @description 获取缓存，存入的如果是Object，取出的也是Object，不需要再转换
 * @param name {String} 缓存名称
 * @param value {String, Boolean, Number, Object} 缓存数据，可以直接传入Object
 * @param seconds {Number} 缓存时间（秒）
 * @returns value 返回数据，存的如果是对象，取出的也是对象
 */
export function setCache(name, value, seconds) {
	let e = new Date(),
		expires = seconds ? e.getTime() + seconds * 1000 : '',
		o = {}
	o.value = value
	o.expires = expires
	o = JSON.stringify(o)
	localStorage.setItem(name, o)
}

/**
 * @module Common
 * @export on
 * @description 绑定事件
 * @param element { Element } dom元素对象
 * @param event { String } 事件触发类型 click...
 * @param handler { Function } 事件
 * @returns height
 */
export function on(element, event, handler) {
	if (element && event && handler) {
		element.addEventListener(event, handler, false)
	}
}

/**
 * @module Common
 * @export off
 * @description 解绑事件
 * @param element { Element } dom元素对象
 * @param event { String } 事件触发类型 click...
 * @param handler { Function } 事件
 * @returns height
 */
export function off(element, event, handler) {
	if (element && event) {
		element.removeEventListener(event, handler, false)
	}
}

/**
 * @module Common
 * @export on
 * @description 绑定执行一次事件
 * @param element { Element } dom元素对象
 * @param event { String } 事件触发类型 click...
 * @param handler { Function } 事件
 * @returns height
 */
export function once(element, event, fn) {
	let listener = function () {
		if (fn) {
			fn.apply(this, arguments)
		}
		off(element, event, listener)
	}
	on(element, event, listener)
}

export function trim(value) {
	if (typeof value != 'string') {
		return value
	}
	return value.replace(/^\s+|\s+$/gm, '')
}

// 延迟执行
export function delay() {
	return {
		map: {},
		register(id, fn, time, boo) {
			// 注册
			if (boo) {
				// 防抖，一定时间内只触发第一次
				if (!this.map[id]) {
					// 不存在的先执行fn
					fn()
				}
				this.map[id] = {
					id,
					fn,
					time,
					boo,
					timeout: setTimeout(() => {
						this.destroy(id)
					}, time)
				}
			} else {
				// 节流，一定时间内延迟执行
				if (this.map[id]) {
					// 已存在的先销毁
					this.destroy(id)
				}
				this.map[id] = {
					id,
					fn,
					time,
					boo,
					timeout: setTimeout(fn, time)
				}
			}
		},
		destroy(id) {
			// 销毁
			if (!this.map[id]) {
				return
			}
			clearTimeout(this.map[id].timeout)
			delete this.map[id]
		}
	}
}

// 打开文件，
export function openFile(url) {
	let fileRead = document.body.querySelector('#file-read')
	const protocol = parent.location.protocol // http:  / https:
	url = url.replace('http:', protocol)
	url = url.replace('https:', protocol)
	if (fileRead) {
		fileRead.href = url
	} else {
		fileRead = document.createElement('a')
		fileRead.id = 'file-read'
		fileRead.href = url
		fileRead.setAttribute('target', '_blank')
		document.body.appendChild(fileRead)
	}
	fileRead.click()
}

// 打印，
export function printFile(url) {
	let iframe = document.body.querySelector('.iframe-file')
	if (iframe) {
		iframe.src = url
	} else {
		iframe = document.createElement('iframe')
		iframe.className = 'iframe-file'
		iframe.src = url
		document.body.appendChild(iframe)
	}
	iframe.contentWindow.focus()
	iframe.contentWindow.print()
}
/**
 * added by saqqdy on 2019.5.29
 * 获取文本长度，中文算2个字节
 * @param {String} str 字符串
 * @returns {Number} 返回长度
 */
function getCHSLength(str) {
	// eslint-disable-next-line no-control-regex
	return str.replace(/[^\x00-\xff]/g, '**').length
}

/**
 * added by saqqdy on 2019.5.29
 * 截取字符串，中文算2个字节
 * @param {String} str 要截取的字符串
 * @param {Number} len
 * @param {Boolean} hasDot
 * @returns {String} 返回截取后的字符串
 */
function cutCHSString(str, len = str.length, hasDot = false) {
	if (str == '' || !str) {
		return ''
	} else {
		let newLength = 0,
			newStr = '',
			// eslint-disable-next-line no-control-regex
			chineseRegex = /[^\x00-\xff]/g,
			singleChar = '',
			strLength = str.replace(chineseRegex, '**').length
		for (let i = 0; i < strLength; i++) {
			singleChar = str.charAt(i).toString()
			if (singleChar.match(chineseRegex) != null) {
				newLength += 2
			} else {
				newLength++
			}
			if (newLength > len) {
				break
			}
			newStr += singleChar
		}

		if (hasDot && strLength > len) {
			newStr += '...'
		}
		return newStr
	}
}

/**
 * added by saqqdy on 2019.10.17
 * 截取小数点后几位，不足的不补0
 * @param {Number, String} number 要处理的数字，必填
 * @param {Number} n 要保留的小数点位数，默认保留2位
 * @returns {Number} 返回新数字
 */
function fixNumber(number, n = 2) {
	let reg = new RegExp('^(.*\\..{' + n + '}).*$')
	number += ''
	if (!/^(\-|\+)?\d+(\.\d+)?$/.test(number)) {
		console.warn('请传入数字')
		return number
	}
	return parseFloat(number.replace(reg, '$1'), 10)
}

/**
 * added by saqqdy on 2020.02.20
 * @description 获取浏览器内核类型，返回前缀
 */
function getCorePrefix() {
	let body = document.body || document.documentElement,
		style = body.style,
		vendor = ['webkit', 'khtml', 'moz', 'ms', 'o'],
		i = 0
	while (i < vendor.length) {
		if (typeof style[vendor[i] + 'Transition'] === 'string') {
			return vendor[i]
		}
		i++
	}
}

/**
 * added by saqqdy on 2019.11.07
 * client方法返回一个浏览器判断结果
 * @param {String} name 可选，比如传入MicroMessenger，返回是否为微信内置浏览器
 * @param {String} userAgent 可选，传入自定义的ua，默认取浏览器的navigator.appVersion
 * @returns {Object|Boolean} 返回常用ua匹配表，如果传了name，那么返回是否匹配该终端true/false
 */
function getDevice(name = '', userAgent = navigator.appVersion) {
	const userAgentL = userAgent.toLowerCase()
	const pre = getCorePrefix()
	if (name) {
		return userAgent.indexOf(name) > -1
	} else {
		return {
			prefix: pre,
			isGecko: userAgentL.indexOf('gecko') > -1 && !userAgentL.indexOf('khtml') > -1, // 火狐内核
			isWebkit: userAgentL.indexOf('applewebkit') > -1, // 苹果、谷歌内核
			isOpera: userAgentL.indexOf('opera') > -1 && userAgentL.indexOf('presto') > -1, // opera内核
			isTrident: userAgentL.indexOf('trident') > -1, // IE内核
			isMobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent), // 是否为移动终端
			isiOS: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
			isAndroid: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1, // android终端或者uc浏览器
			isiPhone: userAgent.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
			isiPad: userAgent.indexOf('iPad') > -1, // 是否iPad
			isWeixin: userAgent.indexOf('MicroMessenger') > -1 // 是否微信
		}
	}
}

/**
 * added by saqqdy on 2020.05.14
 * @public nextIndex
 * @description 返回下一个zIndex值
 * @param {Number} min 可选，最小值
 * @param {Number} max 可选，最大值
 */
function nextIndex(min = 5000, max = 10000) {
	let doms = [min]
	;[...document.querySelectorAll('body > *')].forEach(e => {
		let n = +window.getComputedStyle(e).zIndex || 0
		n > min && n < max && doms.push(n)
	})
	doms.sort((a, b) => b - a)
	return doms[0] + 1
}

/**
 * 阻止默认事件
 * @param {Object} e dom的event对象
 * @returns {Boolean}
 */
function stopDefault(e) {
	if (e && e.preventDefault) {
		e.preventDefault()
	} else {
		window.event.returnValue = false
	}
	return false
}

/**
 * 阻止冒泡
 * @param {Object} e dom的event对象
 * @returns {Boolean}
 */
function stopBubble(e) {
	if (e && e.preventDefault) {
		// Firefox
		e.stopPropagation() //e.preventDefault();
	} else {
		// IE
		e.cancelBubble = true //e.returnValue = false;
	}
	return false
}

function isWindow(obj) {
	return obj !== null && obj === obj.window
}

function isPlainObject(obj) {
	return getType(obj) === 'object' && !isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype
}

function isArray(arr) {
	return Object.prototype.toString.call(arr).indexOf('Array') !== -1
}

function getType(obj) {
	let type = {
		'[object Array]': 'array',
		'[object Boolean]': 'boolean',
		'[object Date]': 'date',
		'[object Function]': 'function',
		'[object Number]': 'number',
		'[object Object]': 'object',
		'[object RegExp]': 'regexp',
		'[object String]': 'string'
	}

	if (obj === null) {
		return obj + ''
	}
	return typeof obj === 'object' || typeof obj === 'function' ? type[Object.prototype.toString.call(obj)] || 'object' : typeof obj
}

//对象扩展
let extend = (function () {
	function extend(target, source, deep) {
		for (let key in source)
			if (source.hasOwnProperty(key)) {
				if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
					if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {}
					if (isArray(source[key]) && !isArray(target[key])) target[key] = []
					extend(target[key], source[key], deep)
				} else if (source[key] !== undefined) target[key] = source[key]
			}
	}
	return function (target) {
		let deep,
			args = Array.prototype.slice.call(arguments, 1)
		if (typeof target === 'boolean') {
			deep = target
			target = args.shift()
		}
		args.forEach(function (arg) {
			extend(target, arg, deep)
		})
		return target
	}
})()

export { getCHSLength, cutCHSString, fixNumber, getDevice, getCorePrefix, nextIndex, stopDefault, stopBubble, isWindow, isPlainObject, isArray, getType, extend }
