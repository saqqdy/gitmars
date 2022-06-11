module.exports = {
    out: 'typedoc',
    entryPoints: ['src/conf/*.ts', 'src/go/index.ts', 'src/*.ts'],
    json: 'typedoc/out.json',
    name: 'index.md',
    includeVersion: true,
    readme: 'README.md'
    // emit: true,
    // exclude: '',
    // externalPattern: '',
    // excludeExternals: ''
}
