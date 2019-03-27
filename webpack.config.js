'use strict';
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SizePlugin = require('size-plugin');

module.exports = {
	stats: 'errors-only',
	entry: {
		content: './source/content',
		background: './source/background',
		options: './source/options'
	},
	output: {
		path: path.join(__dirname, 'distribution'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new SizePlugin(),
		new CopyWebpackPlugin([
			{
				from: '*',
				context: 'source',
				ignore: '*.js'
			},
			{
				from: 'style/*',
				context: 'source'
			},
			{
				from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
			},
			{
				from: 'node_modules/jquery/dist/jquery.slim.min.js'
			}
		])
	]
};
