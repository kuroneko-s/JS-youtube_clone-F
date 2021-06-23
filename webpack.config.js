const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// path.resolve -> 문자열들을 합쳐서 경로로 만들어줌 ( 걍 문자열 합쳐주는거인듯 )
module.exports = {
  entry: {
    main: "./src/client/js/main.js",
    videoPlayer: "/src/client/js/videoPlayer.js",
    recorder: "/src/client/js/recorder.js",
  },
  mode: "development",
  watch: true, // nodemon 처럼 동작
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true, // 해당 폴더 삭제 해줌. but! 재시작할때만 적용됨
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
