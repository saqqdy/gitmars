import { bold, cyan, green, yellow } from 'colors'
// import pkg from '../../package.json'
// const deps = Object.keys(pkg.dependencies || {})
const noWlPrefixFile =
    /(utils|styles|style|directives|plugins|filters|images|hooks|locale|directives)/

export function external(id) {
    return (
        /^vue/.test(id) || /^kdesign-vue\//.test(id)
        //  || deps.some(k => new RegExp('^' + k).test(id))
    )
}

export function pathRewriter(bundlePath) {
    return id => {
        if (/^kdesign-vue\/packages/.test(id)) {
            if (noWlPrefixFile.test(id)) {
                return id.replace('kdesign-vue/packages/', bundlePath)
            }
            return id.replace('kdesign-vue/packages/', bundlePath)
        }
        if (/^@\//.test(id)) {
            return id.replace(/^@/, bundlePath)
        }
    }
}

export const reporter = (opt, outputOptions, info) =>
    `${cyan(
        bold(
            (info.fileName &&
                `${outputOptions.file?.split('packages/').pop()}`) ||
                ''
        )
    )}: bundle size ${yellow(info.bundleSize)} -> minified ${green(
        (info.minSize && `${info.minSize}`) || ''
    )}`
