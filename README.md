# webpack4多页面配置
基于webpack4.的多页应用配置，包括常见的插件使用与配置。


```js
const path = require('path');
const  fs = require('fs');
const  join = require('path').join;
const webpack = require("webpack");
const glob = require("glob");
//消除冗余的css
const purifyCssWebpack = require("purifycss-webpack");
// html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");
//4.x之前用以压缩
const uglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
// 分离css
const extractTextPlugin = require("extract-text-webpack-plugin");
//静态资源输出
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
		// 调用之前先清除
		new cleanWebpackPlugin(["dist"]),
		// 4.x之前可用uglifyjs-webpack-plugin用以压缩文件，4.x可用--mode更改模式为production来压缩文件
		// new uglifyjsWebpackPlugin(),
		new copyWebpackPlugin([{
			from: path.resolve(__dirname,"src/assets"),
			to: './pulic'
		}]),
		// 分离css插件参数为提取出去的路径
		new extractTextPlugin("css/index.css"),
		// 消除冗余的css代码
		new purifyCssWebpack({
			// glob为扫描模块，使用其同步方法
			paths: glob.sync(path.join(__dirname, "src/*.html"))
		}),
		// 全局暴露统一入口
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


let data = findSync('./src/page', {jquery: 'jquery'}); // html文件夹

const config = {
	entry: data.entries,
	output: {
		path:path.resolve(__dirname, 'dist'),
		// 打包多出口文件
		// 生成 a.bundle.js  b.bundle.js  jquery.bundle.js
		filename: './js/[name].bundle.js'
	},
	plugins: data.htmlWebpackPluginArray,
	// devtool: "source-map",  // 开启调试模式
	module:{
		rules: rulesConfig
	},
	// 提取js，lib1名字可改
	optimization: {
		splitChunks: {
			cacheGroups: {
				lib1: {
					chunks: "initial",
					name: "jquery",
					enforce: true
				}
			}
		}
	}
}

module.exports = config;
```