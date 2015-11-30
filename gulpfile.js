var gulp = require('gulp'),
    nodemon = require('nodemon'),
    path = require('path');
    
gulp.task('start', function() {
   nodemon({
       execMap: {
           js: 'node'
       },
       script: path.join(__dirname, 'server/index.js')
   }).on('restart', function() {
       console.log('Application has restarted!');
   });
});