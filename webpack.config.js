/* eslint "flowtype/require-valid-file-annotation": 0 */
/* eslint "import/no-commonjs": 0 */

const path = require("path");
const webpack = require("webpack");
const LicenseWebpackPlugin = require("license-webpack-plugin");

const BASE_PLUGINS = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
  })
];
const payload = require("./testpayload");

module.exports = {
  entry:
    process.env.NODE_ENV === "production"
      ? ["babel-polyfill", "./src/index.js"]
      : [
          "babel-polyfill",
          "react-hot-loader/patch",
          "webpack-dev-server/client?http://localhost:8080",
          "webpack/hot/only-dev-server",
          "./src/index.js"
        ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/"
  },
  devServer: {
    contentBase: "public/",
    historyApiFallback: true,
    port: 8080,
    hot: true,
    before(app) {
      app.get("/wannatags/:date", function(req, res) {
        const startDate = parseInt(req.params.date);
        if (startDate === 0) {
          res.json(payload.splice(0, 20));
        } else {
          const i = payload.find(p => p.postDate === startDate);
          if (i < 0) res.json([]);
          else res.json(payload.splice(i + 1, 20));
        }
      });
    }
  },
  plugins:
    process.env.NODE_ENV === "production"
      ? BASE_PLUGINS.concat([
          new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: false,
            compressor: {
              warnings: false
            },
            output: {
              comments: false
            }
          }),
          new LicenseWebpackPlugin({
            pattern: /^(.*)$/,
            filename: "licenses.txt"
          })
        ])
      : BASE_PLUGINS.concat([
          new webpack.NamedModulesPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          new webpack.HotModuleReplacementPlugin()
        ]),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          "style-loader",
          "css-loader?modules&importLoaders=1",
          "postcss-loader?sourceMap=inline"
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"]
  }
};
