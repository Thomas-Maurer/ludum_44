const path = require('path');
var LiveReloadPlugin = require('webpack-livereload-plugin');
const CopyPlugin = require('copy-webpack-plugin');
var webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    WEBGL_RENDERER: true,
    CANVAS_RENDERER: true
})

module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    target: 'web',
    watch: true,
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: "file-loader",

            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: "file-loader",

            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'game.js',
        path: path.resolve(__dirname, 'dist')
    },

    plugins: [
        definePlugin,
        new LiveReloadPlugin(),
        new CopyPlugin([{
                from: 'src/index.html'
            },
            {
                from: 'src/assets',
                to: 'assets'
            }
        ]),
        new VueLoaderPlugin()
    ]
};