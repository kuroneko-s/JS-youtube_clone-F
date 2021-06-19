const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// path.resolve -> 문자열들을 합쳐서 경로로 만들어줌 ( 걍 문자열 합쳐주는거인듯 )
module.exports = {
  entry: "./src/client/js/main.js",
  mode: "development",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
