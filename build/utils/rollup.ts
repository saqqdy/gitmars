import chalk from 'chalk'
// import pkg from '../../package.json'
// const deps = Object.keys(pkg.dependencies || {})
const noWlPrefixFile =
    /(utils|styles|style|directives|plugins|filters|images|hooks|locale|directives)/

export function external(id: string) {
    return (
        /^vue/.test(id) || /^@gitmars\/utils\//.test(id)
        //  || deps.some(k => new RegExp('^' + k).test(id))
    )
}

export function pathRewriter(bundlePath: string) {
    return id => {
        if (/^@gitmars\/utils\/packages/.test(id)) {
            if (noWlPrefixFile.test(id))
                return id.replace('@gitmars/utils/packages/', bundlePath)
            return id.replace('@gitmars/utils/packages/', bundlePath)
        }
        if (/^@\//.test(id)) {
            return id.replace(/^@/, bundlePath)
        }
    }
}

export const reporter = (opt, outputOptions, info) =>
    `${chalk.cyan(
        chalk.bold(
            (info.fileName &&
                `${outputOptions.file?.split('packages/').pop()}`) ||
                ''
        )
    )}: bundle size ${chalk.yellow(info.bundleSize)} -> minified ${chalk.green(
        (info.minSize && `${info.minSize}`) || ''
    )}`
