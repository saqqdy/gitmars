const https = require('https')
const http = require('http')
const zlib = require('zlib')
const { URL } = require('url')
const qs = require('qs')
const getType = require('js-cool/lib/getType')
const { debug } = require('./utils/debug')
const { version: GITMARS_VERSION } = require('../../package.json')

export type RequestHeadersType = {
    Host?: string
    rejectUnauthorized?: boolean
    Pragma?: string
    Connection?: string
    Accept?: string
    'Cache-Control'?: string
    'Content-Type'?: string
    'Accept-Language'?: string
    'User-Agent'?: string
} & {
    [prop: string]: string | number | boolean
}

export interface RequestOptionsType {
    // 是否由请求处自行处理error，默认false
    error?: boolean
}

class Request {
    cookies: string[] = []
    constructor() {}
    /**
     * 获取请求头
     *
     * @param host - 请求的域名
     * @param propsData - 请求数据
     * @returns headers - 请求头
     */
    public getHeaders(host: string, postData?: string): RequestHeadersType {
        const headers: RequestHeadersType = {
            Host: host,
            rejectUnauthorized: false,
            Pragma: 'no-cache',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            // 'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,es;q=0.2',
            // Accept: 'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 Gitmars/' +
                GITMARS_VERSION
        }
        if (this.cookies.length) {
            headers.Cookie = this.cookies.join('; ')
        }
        if (postData) {
            headers['Content-Length'] = Buffer.byteLength(postData)
        }
        return headers
    }
    /**
     * 设置cookie
     *
     * @param cookie - cookie
     * @returns this - 当前类
     */
    public setCookie(cookie: string) {
        const cookies = cookie.split(';')
        for (let item of cookies) {
            item = item.replace(/^\s/, '')
            this.cookies.push(item)
        }
        return this
    }
    /**
     * 发起请求
     *
     * @param method - 请求方法：'GET' | 'POST' | 'DELETE' | 'OPTIONS' | 'PUT' | 'PATCH' | 'TRACE' | 'HEAD'
     * @param url - 请求链接
     * @param postData - 序列化之后的请求参数
     * @returns Promise - 请求结果
     */
    public request(
        method:
            | 'GET'
            | 'POST'
            | 'DELETE'
            | 'OPTIONS'
            | 'PUT'
            | 'PATCH'
            | 'TRACE'
            | 'HEAD',
        url: string,
        postData?: string,
        headers: RequestHeadersType = {},
        options: RequestOptionsType = {}
    ) {
        const urlObj = new URL(url)
        headers = { ...this.getHeaders(urlObj.host, postData), ...headers }
        const params = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method,
            headers
        }
        return new Promise((resolve, reject) => {
            const req = (urlObj.protocol == 'http:' ? http : https).request(
                params,
                (res: any) => {
                    const chunks: any[] = []
                    res.on('data', (buffer: any) => {
                        // console.info(JSON.parse(Buffer.from(buffer).toString()))
                        chunks.push(buffer)
                    })
                    res.on('end', () => {
                        const buffer = Buffer.concat(chunks)
                        const encoding = res.headers['content-encoding']
                        let data
                        if (encoding === 'gzip') {
                            zlib.gunzip(
                                buffer,
                                function (err: Error, decoded: any) {
                                    data = decoded.toString()
                                }
                            )
                        } else if (encoding === 'deflate') {
                            zlib.inflate(
                                buffer,
                                function (err: Error, decoded: any) {
                                    data = decoded.toString()
                                }
                            )
                        } else {
                            data = buffer.toString()
                            try {
                                data = JSON.parse(data)
                            } catch {
                                // console.warn('data is not json', data)
                            }
                        }
                        debug(
                            'request-result',
                            { method, url, postData, headers, options },
                            data
                        )
                        if (
                            /<html>/.test(data) ||
                            (getType(data) === 'object' &&
                                (data.status === false ||
                                    data.success === false))
                        ) {
                            if (options.error) {
                                // 请求端自行处理error
                                reject(data)
                            } else {
                                // 直接抛出异常
                                console.error(
                                    typeof data === 'object'
                                        ? data.msg || data.message
                                        : data
                                )
                            }
                            return
                        }
                        resolve(data)
                    })
                }
            )
            req.on('error', (err: Error) => {
                if (options.error) {
                    // 请求端自行处理error
                    reject(err)
                    return
                }
                console.error(err)
            })
            if (postData) {
                req.write(postData)
            }
            req.end()
        })
    }
    /**
     * get方法
     *
     * @param option - 参数
     * @param option.url - 请求链接
     * @returns Promise - 请求结果
     */
    public async get({ url, data = {}, headers = {}, options = {} }: any) {
        const postData = qs.stringify(data, {
            arrayFormat: 'indices',
            allowDots: true
        })
        if (postData) {
            url += url.indexOf('?') === -1 ? '?' : '&'
            url += postData
        }
        return await this.request('GET', url, '', headers, options)
    }
    /**
     * post方法
     *
     * @param option - 参数
     * @param option.url - 请求链接
     * @param option.params - 请求参数
     * @returns Promise - 请求结果
     */
    public async post({ url, data = {}, headers = {}, options = {} }: any) {
        let postData
        if (['application/json'].includes(headers['Content-Type'])) {
            // raw json格式
            postData = JSON.stringify(data)
        } else {
            postData = qs.stringify(data, {
                arrayFormat: 'indices',
                allowDots: true
            })
        }
        return await this.request('POST', url, postData, headers, options)
    }
    /**
     * put方法
     *
     * @param option - 参数
     * @returns Promise - 请求结果
     */
    public async put({ url, data = {}, headers = {}, options = {} }: any) {
        let postData
        if (['application/json'].includes(headers['Content-Type'])) {
            // raw json格式
            postData = JSON.stringify(data)
        } else {
            postData = qs.stringify(data, {
                arrayFormat: 'indices',
                allowDots: true
            })
        }
        return await this.request('PUT', url, postData, headers, options)
    }
    /**
     * delete方法
     *
     * @param option - 参数
     * @returns Promise - 请求结果
     */
    public async delete({ url, data = {}, headers = {}, options = {} }: any) {
        let postData
        if (['application/json'].includes(headers['Content-Type'])) {
            // raw json格式
            postData = JSON.stringify(data)
        } else {
            postData = qs.stringify(data, {
                arrayFormat: 'indices',
                allowDots: true
            })
        }
        return await this.request('DELETE', url, postData, headers, options)
    }
}

module.exports = new Request()
