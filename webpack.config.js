const HtmlWebPackPlugin = require("html-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const stylintOptions = require('./.stylelintrc.js');
const path = require('path');
module.exports = {
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"]
  },
  entry: "./src/index.jsx",
  module: {
    rules: [
      //   { //ts 配置
      //     test: /\.tsx?$/,
      //     exclude: /node_modules/,
      //     use: 'ts-loader',
      //   },
      {
        test: /\.jsx?$/, // jsx/js文件的正则
				exclude: /node_modules/, // 排除 node_modules 文件夹
				include: [path.resolve(__dirname, 'src')],
        use: {
          // loader 是 babel
          loader: "babel-loader",
          options: {
            // babel 转义的配置选项
            babelrc: false,
            presets: [
              // 添加 preset-react
              require.resolve("@babel/preset-react"),
              [
                require.resolve("@babel/preset-env"),
                {
                  modules: false,
                  useBuiltIns: "usage"
                }
              ]
            ],
            cacheDirectory: true
          }
        }
			},
			{
				test: /\.jsx?$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: [path.resolve(__dirname, 'src')],
				options: {
					// 在这里的配置参数会传递到eslint的CLIEngine
					formatter: require('eslint-friendly-formatter') //指定错误报告格式规范
				}
			},
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
					},
        ]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          "less-loader" // 将 Less 编译为 CSS
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "src/index.html",
      filename: "index.html"
    }),
    // new StyleLintPlugin(stylintOptions),
  ]
};
