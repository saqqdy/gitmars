const https = require('https')
const http = require('http')
const zlib = require('zlib')
const { URL } = require('url')
const qs = require('qs')

class Request {
    cookies: string[] = []
    constructor() {
        // if (cookie) {
        //     this.setCookie(cookie)
        // }
    }
    /**
     * 获取请求头
     *
     * @param host - 请求的域名
     * @param propsData - 请求数据
     * @returns headers - 请求头
     */
    public getHeaders(host: string, postData?: string) {
        const headers: { [prop: string]: string | number | boolean } = {
            Host: host,
            rejectUnauthorized: false,
            Pragma: 'no-cache',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,es;q=0.2',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36'
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
     * @param method - 请求方法：'GET' | 'POST' | 'DELETE' | 'OPTIONS'
     * @param url - 请求链接
     * @param postData - 序列化之后的请求参数
     * @returns Promise - 请求结果
     */
    public request(
        method: 'GET' | 'POST' | 'DELETE' | 'OPTIONS',
        url: string,
        postData?: string
    ) {
        const urlObj = new URL(url)
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method,
            headers: this.getHeaders(urlObj.host, postData)
        }
        return new Promise((resolve, reject) => {
            const req = (urlObj.protocol == 'http:' ? http : https).request(
                options,
                (res: any) => {
                    const chunks: any[] = []
                    res.on('data', (buf: any) => {
                        // console.info(JSON.parse(Buffer.from(buf).toString()))
                        chunks.push(buf)
                    })
                    res.on('end', () => {
                        const buffer = Buffer.concat(chunks)
                        const encoding = res.headers['content-encoding']
                        if (encoding === 'gzip') {
                            zlib.gunzip(
                                buffer,
                                function (err: Error, decoded: any) {
                                    resolve(decoded.toString())
                                }
                            )
                        } else if (encoding === 'deflate') {
                            zlib.inflate(
                                buffer,
                                function (err: Error, decoded: any) {
                                    resolve(decoded.toString())
                                }
                            )
                        } else {
                            resolve(JSON.parse(buffer.toString()))
                        }
                    })
                }
            )
            req.on('error', (err: Error) => {
                reject(err)
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
    public async get({ url, data = {} }: any) {
        const postData = qs.stringify(data, {
            arrayFormat: 'indices',
            allowDots: true
        })
        if (postData) {
            url += url.indexOf('?') !== -1 ? '?' : '&'
            url += postData
        }
        return await this.request('GET', url)
    }
    /**
     * post方法
     *
     * @param option - 参数
     * @param option.url - 请求链接
     * @param option.params - 请求参数
     * @returns Promise - 请求结果
     */
    public async post({ url, data }: any) {
        const postData = qs.stringify(data, {
            arrayFormat: 'indices',
            allowDots: true
        })
        return await this.request('POST', url, postData)
    }
}

module.exports = new Request()
