const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
  entry: {
    cli: path.join(__dirname, 'src', 'cli.js'),
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules'),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'src', 'utils', 'fonts'),
        to: path.join(__dirname, 'lib', 'fonts'),
      },
    ]),
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
