module.exports = function (grunt) {
    grunt.initConfig({
        watch: {
            files: ['**/*.js'],
            tasks: ['jasmine', 'jshint']
        },

		nugetpack: {
			dist: {
				src: 'nuget/backbone.hypermedia.nuspec',
				dest: 'nuget/',

				options: {
					version: "0.1.2"
				}
			}
		},
		
		nugetpush: {
			dist: {
				src: 'nuget/*.nupkg'
			}
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
        },

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-nuget');

    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('default', ['jshint', 'jasmine']);

};
