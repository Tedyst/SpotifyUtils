module.exports = {
    staticFileGlobs: [
        'build/*.html',
        'build/manifest.json',
        'build/static/**/!(*map*)'
    ],
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    swFilePath: './build/service-worker.js',
    stripPrefix: 'build/',
    runtimeCaching: [{
        urlPattern: /admin/,
        handler: 'networkOnly'
    }, {
        urlPattern: /api/,
        handler: 'networkOnly'
    },
    {
        urlPattern: /logout/,
        handler: 'networkOnly'
    }]
}