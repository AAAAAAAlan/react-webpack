const HtmlWebPackPlugin = require("html-webpack-plugin");
const autoprefixer = require('autoprefixer');
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
    })
  ]
};
