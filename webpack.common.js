const path = require('path');
const  fs = require('fs');
const  join = require('path').join;
const webpack = require("webpack");
const glob = require("glob");
const purifyCssWebpack = require("purifycss-webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const uglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const extractTextPlugin = require("extract-text-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const rulesConfig = require("./webpack.rules.js");

function findSync(startPath, libObject) {
	
	let result=[];
	
	function finder(path) {
		let files=fs.readdirSync(path);
		files.forEach((val,index) => {
			let fPath=join(path,val);
			let stats=fs.statSync(fPath);
			if(stats.isDirectory()) finder(fPath);
			if(stats.isFile()) result.push(fPath);
		});
	}
	
	finder(startPath);
	
	const chunks = []
	
	const htmlWebpackPluginArray = [
		new webpack.HotModuleReplacementPlugin(),
		new cleanWebpackPlugin(["dist"]),
		new copyWebpackPlugin([{
			from: path.resolve(__dirname,"src/assets"),
			to: './pulic'
		}]),
		new extractTextPlugin("css/index.css"),
		new purifyCssWebpack({
			paths: glob.sync(path.join(__dirname, "src/*.html"))
		}),
		new webpack.ProvidePlugin({
			$: "jquery"
		}),
	]
	
	const entries = {}
	
	result.forEach(path => {
		
		const chunk = path.replace(/.html/g, '').split('/').pop()
		entries[chunk] = './src/js/' + path.match(/[^\/]*[.]+/g)[0] + 'js'; // js 入口
		chunks.push(chunk)
		const filename = chunk + '.html'
		
		const htmlConf = {
			filename: filename,
			template: path.replace(/.js/g, '.html'),
			inject: 'body',
			favicon: '',
			hash: true,
			chunks: [...Object.keys(libObject), chunk]
		}
		
		htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
		
	})
	Object.assign( entries, libObject)
	return {
		htmlWebpackPluginArray:htmlWebpackPluginArray,
		entries: entries
	}
}


let data = findSync('./src/page', {jquery: 'jquery'});

const config = {
	entry: data.entries,
	output: {
		path:path.resolve(__dirname, 'dist'),
		filename: './js/[name].bundle.js'
	},
	plugins: data.htmlWebpackPluginArray,
	module:{
		rules: rulesConfig
	},
}

module.exports = config;