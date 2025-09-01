/*eslint-env node*/
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = (env, options) => {
	return {
		entry: './examples/src/index.jsx',
		output: {
			path: path.resolve(__dirname, 'examples/dist'),
			filename: 'index.js',
		},
		performance: {
			hints: false // Disable assets limit
		},
		module: {
			rules: [{
				test: /\.jsx?/,
				exclude: /node_modules/,
				use: [
					'babel-loader',
				],
			}, {
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader'
				}, {
					loader: 'sass-loader',
					options: {
						api: 'modern-compiler',
						implementation: require('sass'),
					}
				}]
			}, {
				test: /\.html$/,
				exclude: /node_modules/,
				use: [{
					loader: 'html-loader',
					options: {
						minimize: true
					}
				}]
			}]
		},
		resolve: {
			extensions: ['.json', '.js', '.jsx'],
		},
		plugins: [
			new HtmlWebPackPlugin({
				template: './examples/src/index.html',
				filename: './index.html'
			}),
			new ESLintPlugin({
				extensions: ['js', 'jsx'],
				emitWarning: options.mode === 'development',
			})
		]
	};
};