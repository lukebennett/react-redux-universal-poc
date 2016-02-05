'use strict';

var gulp = require('gulp'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    nodemon = require('nodemon'),
    path = require('path'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    config = require('config'),
    DeepMerge = require('deep-merge'),
    sharedConfig = {},
    backendConfig = {},
    frontendConfig = {},
    node_modules = {},
    initialised = false,
    webpackHost = config.webpackHost || 'localhost',
    webpackPort = config.webpackPort || '8001';

const production = process.env.NODE_ENV === 'production';

const extend = DeepMerge(function(target, source, key) {
  if (target instanceof Array) {
    return [].concat(target, source || []);
  }
  return source;
});

//
// SHARED CONFIG
//
sharedConfig = {
  module: {
    loaders: [{
      loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015,presets[]=stage-1'],
      test: /\.jsx?$/,
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      shared: path.join(__dirname, 'shared')
    }
  },
  plugins: [],
  devtool: 'sourcemap',
  debug: !production
};

function getConfig(webpackConfig) {
  let config = extend({}, sharedConfig);
  return extend(config, webpackConfig);
}

//
// BACKEND CONFIG
//
fs.readdirSync('node_modules')
  .forEach(function(module) {
    node_modules[module] = 'commonjs ' + module;
  });

backendConfig = getConfig({
  entry: ['babel-polyfill', './server/init.js'],
  target: 'node',
  node: {
    __filename: true,
    __dirname: false
  },
  externals: node_modules,
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  recordsPath: path.join(__dirname, 'build/_backendRecords'),
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
  ]
});

//
// FRONTEND CONFIG
//
frontendConfig = getConfig({
  entry: ['./client/js/main.js'],
  output: {
    path: path.join(__dirname, 'static/js'),
    publicPath: production ? '/static/js/' : `http://${webpackHost}:${webpackPort}/static/js/`,
    filename: 'frontend.js'
  },
  plugins: []
});

if (!production) {
  frontendConfig.entry = [
    'babel-polyfill',
    `webpack-dev-server/client?http://${webpackHost}:${webpackPort}`,
    'webpack/hot/only-dev-server'
  ].concat(frontendConfig.entry);

  frontendConfig.plugins = frontendConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin({ quiet: true }),
    new webpack.NoErrorsPlugin()
  ]);
}

//
// TASKS
//
gulp.task('backend-watch', function(done) {
  var isDone = false;
  gutil.log('Firing up the backend...');

  webpack(backendConfig).watch(100, function(err, stats) {
    if (err) { throw new gutil.PluginError('webpack', err); }
    if (!isDone) { done(); isDone = true; }
    if (initialised) { nodemon.restart(); }
    initialised = true;
  });
});

gulp.task('frontend-watch', function(done) {
  var isDone = false;
  gutil.log('Firing up the frontend...');

  if (production) {
    webpack(frontendConfig).watch(100, function(err, stats) {
      if (err) { throw new gutil.PluginError('webpack', err); }
      if (!isDone) { done(); isDone = true; }
    });
  } else {
    done();

    new WebpackDevServer(webpack(frontendConfig), {
      publicPath: frontendConfig.output.publicPath,
      hot: true,
      quiet: false,
      stats: {
        cached: false,
        cachedAssets: false,
        exclude: ['node_modules']
      }
    }).listen(webpackPort, webpackHost, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        gutil.log(`Webpack dev server is listening at ${webpackHost}:${webpackPort}`);
      }
    });
  }
});

gulp.task('start', ['backend-watch', 'frontend-watch'], function() {
  nodemon({
   execMap: {
     js: 'node'
   },
   script: path.join(__dirname, 'build/backend.js'),
   ignore: ['*']
  })
  .on('restart', function() {
     gutil.log('Application has restarted!');
  });
  process.on('SIGINT', function() {
    gutil.log('Application has terminated!');
    process.exit();
  });
});
