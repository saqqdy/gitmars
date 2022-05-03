import express from 'express'
const STATIC_MAX_AGE = 1 * 24 * 60 * 60
const HTML_MAX_AGE = 0

export default function (path) {
    return [
        express.static(path, {
            maxAge: STATIC_MAX_AGE,
            immutable: true,
            setHeaders: function (res, path) {
                res.set('x-timestamp', Date.now())
                if (path.substr(-5) === '.html')
                    res.set(
                        'Cache-Control',
                        `public, max-age=${HTML_MAX_AGE}, s-maxage=${HTML_MAX_AGE}, immutable, must-revalidate`
                    )
                else
                    res.set(
                        'Cache-Control',
                        `public, max-age=${STATIC_MAX_AGE}, s-maxage=${STATIC_MAX_AGE}, immutable`
                    )
            }
        })
    ]
}
