const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const noop = require('noop-webpack-plugin')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = (env) => {
  const isProduction = env === 'production'

  const clean = new CleanWebpackPlugin([path.resolve(__dirname, 'public')])

  const extractText = new ExtractTextPlugin({
    filename: '[name].min.css?[hash]',
    allChunks: true,
  })

  const uglifyJS = isProduction ? new webpack.optimize.UglifyJsPlugin({
    comments: false,
    mangle: true,
    sourceMap: true,
  }) : noop()

  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    inject: true,
    template: path.resolve(__dirname, 'client', 'public', 'index.html'),
    favicon: path.resolve(__dirname, 'client', 'public', 'favicon.ico')
  })

  const providePlugin = new webpack.ProvidePlugin({
    $: require.resolve('jquery'),
    jQuery: require.resolve('jquery'),
    Raphael: require.resolve('raphael'),
    moment: require.resolve('moment'),
    'window.$': require.resolve('jquery'),
    'window.jQuery': require.resolve('jquery'),
    'window.Raphael': require.resolve('raphael'),
    'window.moment': require.resolve('moment'),
  })

  const commonChunks = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks(module) {
      /*if (module.resource && (/^.*\.(css|less)$/).test(module.resource)) {
        return false
      }*/
      return module.context && module.context.includes('node_modules')
    },
  })

  return {
    context: path.resolve(__dirname, 'client'),
    entry: {
      bundle: ['babel-polyfill', './entry.js'],
    },
    output: {
      filename: '[name].min.js?[hash]',
      path: path.resolve(__dirname, 'public'),
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        Templates: path.resolve(__dirname, 'client', 'templates'),
        Routes: path.resolve(__dirname, 'client', 'javascripts', 'routes'),
        Contents: path.resolve(__dirname, 'client', 'templates', 'contents'),
        Libraries: path.resolve(__dirname, 'client', 'javascripts', 'lib'),
        Stylesheets: path.resolve(__dirname, 'client', 'stylesheets'),
      },
    },
    module: {
      noParse(content) {
        return /noparse/.test(content)
      },
      loaders: [
        {
          test: require.resolve('jquery'),
          use: [{
            loader: require.resolve('expose-loader'),
            options: 'jQuery',
          }, {
            loader: require.resolve('expose-loader'),
            options: '$',
          }],
        },
        {
          test: require.resolve('moment'),
          use: [{
            loader: require.resolve('expose-loader'),
            options: 'moment',
          }],
        },
        {
          test: /\.js$/,
          exclude: /(?:node_modules|public)/,
          loader: require.resolve('babel-loader'),
        }, {
          test: /\.(?:hbs|handlebars)$/,
          exclude: /(?:node_modules|public)/,
          loader: require.resolve('handlebars-loader'),
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
          test: /\.(?:ttf|eot|svg|woff2?)(?:\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: require.resolve('file-loader'),
          options: {
            name: '[name].[ext]',
            publicPath: '',
            outputPath: 'fonts/',
          },
        }, {
          test: /\.(?:png|jpg|gif)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            publicPath: '',
          },
        },
        {
          test: /\.(?:le|c)ss$/,
          exclude: path.resolve(__dirname, 'client', 'stylesheets', 'routes'),
          loader: extractText.extract({
            publicPath: '/',
            fallback: 'style-loader',
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  sourceMap: true,
                  minimize: true,
                },
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  sourceMap: true,
                  minimize: true,
                },
              },
            ],
          }),
        },
        {
          test: /\.(?:le|c)ss$/,
          include: path.resolve(__dirname, 'client', 'stylesheets', 'routes'),
          loader: extractText.extract({
            publicPath: '/',
            fallback: require.resolve('style-loader'),
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  sourceMap: true,
                  minimize: true,
                  modules: true,
                  localIdentName: '[name]__[local]--[hash:base64:8]',
                },
              },
              {
                loader: require.resolve('less-loader'),
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
      htmlWebpackPlugin,
      clean,
      uglifyJS,
      commonChunks,
      extractText,
      providePlugin,
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      publicPath: '/',
      historyApiFallback: true,
      port: 3000,
    },
  }
}
