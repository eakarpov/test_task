const path = require('path');
const webpack = require('webpack');

const config = {
  entry: path.join(__dirname, './client/src/index.jsx'),
  output: {
    path: path.join(__dirname, './client/public'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, './client'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                ['env', {
                  "targets": {
                    "browsers": ["> 1%"]
                  }
                }],
                'react']
            },
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader',
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    })
  ],
};

module.exports = config;
