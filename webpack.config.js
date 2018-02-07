const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const noop = require('noop-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = (env) => {
  const isProduction = env === 'production'

  const clean = isProduction ? new CleanWebpackPlugin([path.resolve(__dirname, 'public', 'generated')]) : noop()

  const extractText = new ExtractTextPlugin({
    filename: '[name].min.css',
    allChunks: true,
  })

  const uglifyJS = isProduction ? new webpack.optimize.UglifyJsPlugin({
    comments: false,
    mangle: true,
    sourceMap: true,
  }) : noop()

  const providePlugin = new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    Raphael: 'raphael',
    moment: 'moment',
    'window.$': 'jquery',
    'window.jQuery': 'jquery',
    'window.Raphael': 'raphael',
    'window.moment': 'moment',
  })

  const commonChunks = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks(module) {
      if (module.resource && (/^.*\.(css|less)$/).test(module.resource)) {
        return false
      }
      return module.context && module.context.includes('node_modules')
    },
  })

  return {
    context: path.resolve(__dirname, 'client'),
    entry: {
      bundle: ['babel-polyfill', './entry.js'],
    },
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'public', 'generated'),
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        Templates: path.resolve(__dirname, 'client', 'templates'),
        Routes: path.resolve(__dirname, 'client', 'javascripts', 'routes'),
        Contents: path.resolve(__dirname, 'client', 'templates', 'contents'),
        Libraries: path.resolve(__dirname, 'client', 'javascripts', 'lib'),
      },
    },
    module: {
      loaders: [
        {
          test: require.resolve('jquery'),
          use: [{
            loader: 'expose-loader',
            options: 'jQuery',
          }, {
            loader: 'expose-loader',
            options: '$',
          }],
        },
        {
          test: require.resolve('moment'),
          use: [{
            loader: 'expose-loader',
            options: 'moment',
          }],
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|public)/,
          loader: 'babel-loader',
        }, {
          test: /\.(hbs|handlebars)$/,
          exclude: /(node_modules|public)/,
          loader: 'handlebars-loader',
          query: {
            partialDirs: [
              path.resolve(__dirname, 'client', 'templates', 'partials'),
            ],
            helperDirs: [
              path.resolve(__dirname, 'client', 'templates', 'helpers'),
            ],
          },
        },
        {
          test: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '',
            outputPath: 'fonts/',
          },
        }, {
          test: /\.(png|jpg|gif)$/,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            publicPath: '',
          },
        },
        {
          test: /\.(less)$/,
          loader: extractText.extract({
            publicPath: '/',
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: true,
                },
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap: true,
                  minimize: true,
                },
              },
            ],
          }),
        },
      ],
    },
    plugins: [
      clean,
      uglifyJS,
      commonChunks,
      extractText,
      providePlugin,
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      publicPath: '/generated/',
      historyApiFallback: true,
      port: 3000,
    },
  }
}
