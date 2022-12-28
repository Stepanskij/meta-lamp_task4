const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
  assets: "assets/",
};

const pluginsOptions = [];

const entries = {};

pluginsOptions.push(
  new HtmlWebpackPlugin({
    filename: "./example.html",
    template: `${PATHS.src}/test-pages/example/example.pug`,
    inject: true,
    chunks: ["example"],
  })
);
pluginsOptions.push(
  new HtmlWebpackPlugin({
    filename: "./index.html",
    template: `${PATHS.src}/test-pages/index/index.pug`,
    inject: true,
    chunks: ["index"],
  })
);

entries.example = `${PATHS.src}/test-pages/example/example.ts`;
entries.index = `${PATHS.src}/test-pages/index/index.ts`;

pluginsOptions.push(
  new MiniCssExtractPlugin({
    filename: "[name].css",
  })
);

module.exports = {
  externals: {
    paths: PATHS,
  },

  entry: entries,

  output: {
    filename: "[name].js?v=[hash]",
    path: PATHS.dist,
    publicPath: "/",
  },

  plugins: pluginsOptions,

  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "..", "src")],
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".pug"],
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: "pug-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.(gif|png|jpg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: true } },
          {
            loader: "postcss-loader",
            options: { sourceMap: true, config: { path: `postcss.config.js` } },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: true } },
          {
            loader: "postcss-loader",
            options: { sourceMap: true, config: { path: `postcss.config.js` } },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
};
