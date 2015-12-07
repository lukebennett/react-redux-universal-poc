var gulp = require('gulp'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    nodemon = require('nodemon'),
    path = require('path'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    config = require('config'),
    backendConfig = {},
    frontendConfig = {},
    node_modules = {},
    initialised = false,
    webpackHost = config.webpackHost,
    webpackPort = config.webpackPort;
   
const production = process.env.NODE_ENV === 'production';
   
//
// BACKEND CONFIG
//
fs.readdirSync('node_modules')
  .forEach(function(module) {
    node_modules[module] = 'commonjs ' + module;
  });
   
backendConfig = {
  entry: ['./server/init.js'],
  target: 'node',
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  node: {
    __filename: true,
    __dirname: false
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  externals: node_modules,
  output: {
    path: path.join(__dirname, 'server/build'),
    filename: 'backend.js'
  },
  recordsPath: path.join(__dirname, 'server/build/_records'),
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
  ],
  devtool: 'sourcemap'
};

//
// FRONTEND CONFIG
//
frontendConfig = {
  entry: ['./client/js/main.js'],
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  output: {
    path: path.join(__dirname, 'client/build'),
    publicPath: production ? '/client/' : `http://${webpackHost}:${webpackPort}/client/`,
    filename: 'frontend.js'
  },
  plugins: [],
  devtool: 'sourcemap'
};

if (!production) {
  frontendConfig.entry = [
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
    if (err) { throw new gutil.PluginError("webpack", err); }
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
      if (err) { throw new gutil.PluginError("webpack", err); }
      if (!isDone) { done(); isDone = true; }
    });
  } else {
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
      done();
    });
  }
});

gulp.task('start', ['backend-watch', 'frontend-watch'], function() {
  nodemon({
   execMap: {
     js: 'node'
   },
   script: path.join(__dirname, 'server/build/backend.js'),
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