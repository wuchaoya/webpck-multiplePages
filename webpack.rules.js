const extractTextPlugin = require("extract-text-webpack-plugin");
module.exports = [
			{
				test: /\.css$/,
				use: extractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader"],
					publicPath: "../"

				})
			},
			{
				test: /\.js$/,
				use: ["babel-loader"],
				exclude: "/node_modules/"
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [{
						loader: "url-loader",
						options: {
							limit: 50,
							outputPath: "images"
						}
					}
				]
			},
			{
				test: /\.html$/,
				use: ["html-withimg-loader"]
			},
			{
				test: /\.less$/,
				use: extractTextPlugin.extract({
					fallback:"style-loader",
					use: ["css-loader", "less-loader"]
				})
			},
			{
				test: /\.(scss|sass)$/,
				use: extractTextPlugin.extract({
					fallback:"style-loader",
					use: ["css-loader", "sass-loader"]
				})
			}
		]