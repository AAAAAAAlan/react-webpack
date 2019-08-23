const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
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
  optimization: {
    splitChunks: {
        chunks: 'async', // 三选一： "initial" | "all" | "async" (默认)
        minSize: 30000, // 最小尺寸，30K，development 下是10k，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了
        maxSize: 0, // 文件的最大尺寸，0为不限制，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize
        minChunks: 1, // 默认1，被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
        maxAsyncRequests: 5, // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了
        maxInitialRequests: 3, // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了
        automaticNameDelimiter: '~', // 打包文件名分隔符
        name: true, // 拆分出来文件的名字，默认为 true，表示自动生成文件名，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个
        cacheGroups: {
            vendors: {
                test: /[\\/]node_modules[\\/]/, // 正则规则，如果符合就提取 chunk
                priority: -10 // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
            },
            default: {
                minChunks: 2,
                priority: -20, // 优先级
                reuseExistingChunk: true // 如果该chunk包含的modules都已经另一个被分割的chunk中存在，那么直接引用已存在的chunk，不会再重新产生一个
            }
        }
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
    new BundleAnalyzerPlugin(),
  ]
};
