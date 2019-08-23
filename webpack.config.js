const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const stylintOptions = require('./.stylelintrc.js');
const path = require('path');
module.exports = {
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@': path.resolve('./src'),
    }
  },
  entry: ["./src/index.jsx","./src/dev.js"],
  // 配置CDN域名和路径
  // output: {
  //   publicPath: 'http://xxx.com'
  // },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    open: false,
    hot: true,
    inline: true,
    // proxy: {
    //   '/api': 'http://xxxx.com',
    // }
  },
  module: {
    rules: [
      //   { //ts 配置
      //     test: /\.tsx?$/,
      //     exclude: /node_modules/,
      //     use: 'ts-loader',
      //   },
      {
        test: /\.(png)|(jpg)|(git)|(svg)$/,
        include: [path.resolve(__dirname, './src/assets')],
        use: {
          loader: 'image-webpack-loader',
          options: {
            enfore: 'pre',
          }
        }
      },
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
      },
      {
        test: /\.(png)|(jpg)|(gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 3*1024 //不超过3K大小
          }
        }
      },
      {
        test: /\.{svg}$/,
        loader: 'svg-url-loader',
        options: {
          limit: 10*1024,
          noquotes: false,
          // iesafe: true, //需要兼容IE
        }
      },
      {
        test: /\.(eot|woff|ttf|woff2|appcache|mp4|pdf)(\?|$)/,
        loader: 'file-loader',
        query: {
          name: 'assets/[name].[hash:7].[ext]',
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "src/index.html",
      filename: "index.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new StyleLintPlugin(stylintOptions),
  ]
};
