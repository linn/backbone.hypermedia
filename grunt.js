module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      files: ['<config:jasmine.specs>','src/**/*js'],
      tasks: 'jasmine'
    },
    jasmine : {
      src : 'src/**/*.js',
      specs : 'specs/**/*.js'
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-runner');


  // Default task.
  grunt.registerTask('default', 'jasmine');

};