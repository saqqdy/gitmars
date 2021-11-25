module.exports = {
    out: 'typedoc',
    entryPoints: [
        'bin/core/api/index.ts',
        'bin/core/build/index.ts',
        'bin/core/cache/index.ts',
        'bin/core/git/index.ts',
        'bin/core/go/index.ts',
        // 'bin/core/hook/index.ts',
        'bin/core/shell/index.ts',
        'bin/core/utils/index.ts',
        'bin/core/index.ts'
    ],
    json: 'typedoc/out.json',
    name: 'index.md',
    includeVersion: true,
    readme: 'README.md'
    // emit: true,
    // exclude: '',
    // externalPattern: '',
    // excludeExternals: ''
}
