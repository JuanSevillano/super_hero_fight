module.exports = {
    // Punto de entrada
    entry: './src/index.js',
    // Extensiones que se resuelven automáticamente, cuando haces import en un js no hay que añadir estas extensiones
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules: [
            {
                // Traspilado de babel
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env', '@babel/preset-react'],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-proposal-object-rest-spread',
                        ['@babel/plugin-proposal-decorators', { legacy: true }],
                        '@babel/plugin-proposal-optional-chaining',
                    ],
                },
            },
            {
                // Resuelve los imports de fuentes y svg's
                test: /\.(eot|ttf|woff|woff2|otf|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                        name: './assets/fonts/[name].[ext]',
                        // publicPath: '../',
                    },
                }],
            },
            {
                // Resuelve los imports de imágenes
                test: /\.(gif|png|jpe?g)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/img/',
                    },
                }],
            },
        ],
    },
};
