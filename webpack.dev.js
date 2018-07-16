const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const webHost = require('./src/utiliy/webHost.js');
module.exports = env => {
	console.log(env)
	return (merge(common, {
		devtool: 'inline-source-map',
		devServer: {
			port: '',
			contentBase: path.resolve(__dirname, "dist"),
			compress: true,
			open:true,
			proxy: {
				"/api": {
					target: '',
					pathRewrite: {"^/api" : ""}
				}
			}
		}
	}))
}