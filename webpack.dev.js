const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');

// Lee el archivo de env para development
const currentPath = path.join(__dirname, '/.env.dev');
const env = dotenv.config({ path: currentPath }).parsed;
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = merge(common, {
    mode: 'development',
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'build'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
    },
    // Opciones del servidor de desarrollo
    devServer: {
        // Abre la web cuando se arranca el server
        open: true,
        // Los errores los muestra sobre la web
        overlay: true,
        contentBase: './src',
        port: process.env.PORT,
        historyApiFallback: true,
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        // Detecta dependencias circulares
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            // En caso de detección muestra error en lugar de warging
            allowAsyncCycles: false,
            failOnError: true,
            cwd: process.cwd(),
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new webpack.DefinePlugin(envKeys),
    ],
});
