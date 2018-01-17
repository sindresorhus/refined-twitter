'use strict';
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: {
		content: './source/content',
		background: './source/background',
		options: './source/options'
	},
	plugins: [
		new webpack.optimize.ModuleConcatenationPlugin(),
		new CopyWebpackPlugin([{
			from: '*',
			context: 'source',
			ignore: '*.js'
		}, {
			from: 'style/*',
			context: 'source'
		}, {
			from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
		}, {
			from: 'node_modules/jquery/dist/jquery.slim.min.js'
		}])
	],
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
};
