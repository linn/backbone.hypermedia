module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            files: ['**/*.js'],
            tasks: 'jasmine'
        },
        jasmine: {
            src: 'src/*.js',
            options: {
                specs: 'spec/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                        baseUrl: 'src/',
                        paths: {
                            'jquery': '../node_modules/jquery/dist/jquery.min',
                            'backbone': '../node_modules/backbone/backbone-min',
                            'underscore': '../node_modules/underscore/underscore-min',
                            'backbone-hypermedia': '../src/backbone-hypermedia-amd'
                        },
                        shim: {
                            'underscore': {
                                exports: '_'
                            },
                            'backbone': {
                                deps: ['underscore', 'jquery'],
                                exports: 'Backbone'
                            }
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jasmine']);

};