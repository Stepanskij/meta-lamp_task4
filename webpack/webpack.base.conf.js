const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
/* const CopyWebpackPlugin = require("copy-webpack-plugin"); */
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
  assets: "assets/",
};

/* const pages = []; */

const pluginsOptions = [];
/* pages.forEach((e) => {
  pluginsOptions.push(
    new HtmlWebpackPlugin({
      filename: `./${e.pageName}.html`,
      template: `${PATHS.src}/pages/${e.pageType}/${e.pageName}/${e.pageName}.pug`,
      inject: true,
      chunks: [e.pageName],
    })
  );
}); */

const entries = {};
/* = pages.reduce((obj, curEntry) => {
  obj[
    curEntry.pageName
  ] = `${PATHS.src}/pages/${curEntry.pageType}/${curEntry.pageName}/${curEntry.pageName}.ts`;
  return obj;
}, {}); */

pluginsOptions.push(
  new HtmlWebpackPlugin({
    filename: "./index.html",
    template: `${PATHS.src}/test-pages/index/index.pug`,
    inject: true,
    chunks: ["index"],
  })
);
entries.index = `${PATHS.src}/test-pages/index/index.ts`;

pluginsOptions.push(
  new MiniCssExtractPlugin({
    filename: "[name].css",
  })
);

/* pluginsOptions.push(
  new CopyWebpackPlugin([
    { from: `${PATHS.src}/shared/img`, to: `${PATHS.assets}img` },
  ])
); */

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
