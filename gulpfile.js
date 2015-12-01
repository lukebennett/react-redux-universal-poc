var gulp = require('gulp'),
    webpack = require('webpack'),
    nodemon = require('nodemon'),
    path = require('path'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    backendConfig = {},
    node_modules = {},
    initialised = false;
   
fs.readdirSync('node_modules')
  .forEach(function(module) {
    node_modules[module] = 'commonjs ' + module;
  });
   
backendConfig = {
  entry: ['./server/index.js'],
  target: 'node',
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.jsx?$/,
      exclude: /node_modules/,
      query: {
        presets: ['react', 'es2015']
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
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  recordsPath: path.join(__dirname, 'build/_records'),
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
  ],
  devtool: 'sourcemap'
};
    
gulp.task('backend-watch', function(done) {
  gutil.log('Firing up the backend...');
  var isDone = false;
 
  webpack(backendConfig).watch(100, function(err, stats) {
    if (err) { throw new gutil.PluginError("webpack", err); }
    if (!isDone) { done(); isDone = true; }
    if (initialised) { nodemon.restart(); }
    initialised = true;
  });
});

gulp.task('start', ['backend-watch'], function() {
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