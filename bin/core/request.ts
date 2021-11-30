const https = require('https')
const { URL } = require('url')

function request(options: any) {
    const url = new URL(options.url)
    return new Promise((resolve, reject) => {
        const req = https.request(
            {
                hostname: url.hostname,
                port: url.port,
                path: `${url.pathname}${url.search}`,
                method: 'GET',
                ...options
            },
            (res: any) => {
                res.on('data', (buf: any) => {
                    const data = Buffer.from(buf).toString()
                    let result = null
                    try {
                        result = JSON.parse(data)
                    } catch {
                        //
                    }
                    if (result.code === 0) {
                        resolve(result)
                    } else {
                        reject(result)
                    }
                })
            }
        )
        req.on('error', reject)
        req.end()
    })
}

module.exports = request
