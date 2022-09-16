import express from 'express'
import notFind from '#lib/helper/404'

export default function (path) {
    return [
        express.static(path, {
            maxAge: 0,
            immutable: true
        }),
        notFind
    ]
}
