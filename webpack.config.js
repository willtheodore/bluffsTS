const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

module.exports = env => {

  const nodeEnvironment = env.NODE_ENV;

  return ({
    entry: "./app/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index_bundle.js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
            use: {
              loader: "ts-loader",
            },
            exclude: /node_modules/
        },
        { enforce: "pre", test: /\.js$/, exclude: /node_modules/, loader: "source-map-loader" },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          use: {
            loader: "file-loader"
          }
        },
        {
          test: /\.(jpe?g|png)$/,
          use: {
            loader: "file-loader"
          }
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "app/index.html"
      }),
      new CopyPlugin({ patterns: [{ from: "_redirects" }] })
    ],
    devtool: "source-map",
    mode: nodeEnvironment === "production" ? "production" : "development",
    devServer: {
      historyApiFallback: true,
    }
  })
} 
