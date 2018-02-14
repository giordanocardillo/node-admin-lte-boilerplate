const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const noop = require('noop-webpack-plugin')
const autoprefixer = require('autoprefixer')
const flexBugsFixes = require('postcss-flexbugs-fixes')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')


process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = (env) => {
  const isProduction = env === 'production'

  const clean = new CleanWebpackPlugin([path.resolve(__dirname, 'build')])

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
    template: path.resolve(__dirname, 'public', 'index.html'),
    favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
    minify: false,
  })

  const favicons = new FaviconsWebpackPlugin({
    logo: path.resolve(__dirname, 'public', 'images', 'icon.png'),
    prefix: 'images/favicons/',
    emitStats: false,
    persistentCache: false,
    inject: true,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      coast: true,
      favicons: true,
      firefox: true,
      opengraph: false,
      twitter: true,
      yandex: true,
      windows: true,
    },
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

  return {
    context: path.resolve(__dirname, 'src'),
    entry: {
      bundle: ['babel-polyfill', './entry.js'],
    },
    output: {
      filename: '[name].min.js?[hash]',
      path: path.resolve(__dirname, 'build'),
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        Templates: path.resolve(__dirname, 'src', 'templates'),
        Routes: path.resolve(__dirname, 'src', 'javascripts', 'routes'),
        Contents: path.resolve(__dirname, 'src', 'templates', 'contents'),
        Libraries: path.resolve(__dirname, 'src', 'javascripts', 'lib'),
        Stylesheets: path.resolve(__dirname, 'src', 'stylesheets'),
      },
    },
    module: {
      noParse(content) {
        return /noparse/.test(content)
      },
      loaders: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: [
            {
              options: {
                eslintPath: require.resolve('eslint'),
                fix: true,
              },
              loader: require.resolve('eslint-loader'),
            },
          ],
          exclude: [/[/\\]node_modules[/\\]/, /lib/],
        },
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
          exclude: /(?:node_modules|build)/,
          loader: require.resolve('babel-loader'),
        }, {
          test: /\.(?:hbs|handlebars)$/,
          exclude: /(?:node_modules|build)/,
          loader: require.resolve('handlebars-loader'),
          query: {
            partialDirs: [
              path.resolve(__dirname, 'src', 'templates', 'partials'),
            ],
            helperDirs: [
              path.resolve(__dirname, 'src', 'templates', 'helpers'),
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
          exclude: path.resolve(__dirname, 'src', 'stylesheets', 'routes'),
          loader: extractText.extract({
            publicPath: '/',
            fallback: 'style-loader',
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  sourceMap: true,
                  minimize: true,
                  importLoaders: 2,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  sourceMap: true,
                  ident: 'postcss',
                  plugins: () => [
                    flexBugsFixes,
                    autoprefixer({
                      flexbox: 'no-2009',
                    }),
                  ],
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
          include: path.resolve(__dirname, 'src', 'stylesheets', 'routes'),
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
      favicons,
      clean,
      uglifyJS,
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
