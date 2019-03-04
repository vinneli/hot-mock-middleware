const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const mockMiddleware = require('../../index.js');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true,
        before(app) {
            // 启动 mock 服务
            app.use(
                mockMiddleware(path.resolve(__dirname, 'mock'))
            );
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Development',
            template: 'src/template.html'
        }),
        new webpack.NamedModulesPlugin(), 
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test:/\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-react', 
                            '@babel/preset-env'
                        ],
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.css/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|svg)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx']
    }
};