const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    entry: "./src/main.ts",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "main.js",
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    target: "web",
    node: {
      __dirname: false,
    },
    mode: "development",
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 9000,
    },
  },
];
