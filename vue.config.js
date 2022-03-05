module.exports = {
    publicPath: './',
    assetsDir: './static',
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = ''
                return args
            })
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: []
        },
        pwa: {
            iconPaths:{
                favicon32: '/logo/logo.png',
                favicon16: '/logo/logo.png',
                appleTouchIcon: '/logo/logo.png',
                maskIcon: '/logo/logo.png',
                msTileImage: '/logo/logo.png'
            }
        }
    }
}
