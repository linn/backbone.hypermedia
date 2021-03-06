module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: ['**/*.js'],
            tasks: ['jasmine', 'jshint']
        },

        nugetpack: {
            dist: {
                src: 'nuget/backbone.hypermedia.nuspec',
                dest: 'nuget/',
                options: {
                    version: '<%= pkg.version %>'
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
            all: ['Gruntfile.js', 'src/**/*.js', '!src/**/*.min.map', '!src/**/*.min.js', 'spec/**/*.js']
        },

        clean: ['nuget/*.nupkg'],

	    // pushes to npm
        release: {
            options: {
            	// we'll use grunt-bump to increment the version as it
            	// supports reloading the pkg config var which we need
            	// as it is referenced when the nuget tasks are run
                bump: false,
                commitMessage: 'Release <%= version %>'
                /*github: { 
                    repo: 'linn/backbone.hypermedia'
                }*/
            }
        },

        bump: {
            options: {
            	// reload pkg config var after bump
                updateConfigs: ['pkg'],
                commit: false,
                createTag: false,
                push: false
            }
        },
		
		uglify: {
			my_target: {
				options: {
					sourceMap: true,
					sourceMapName: 'src/backbone-hypermedia-amd.min.map'
				},
				files: {
					'src/backbone-hypermedia-amd.min.js': ['src/backbone-hypermedia-amd.js']
				}
			}
		}
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-nuget');
    grunt.loadNpmTasks('grunt-release');
	grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('test', ['jshint', 'jasmine']);
	grunt.registerTask('minify', ['uglify']);
    grunt.registerTask('default', ['test', 'minify']);
    grunt.registerTask('publish', ['publish:patch']);
    grunt.registerTask('publish:patch', ['clean', 'minify', 'bump:patch', 'release', 'nugetpack', 'nugetpush']);
    grunt.registerTask('publish:minor', ['clean', 'minify', 'bump:minor', 'release', 'nugetpack', 'nugetpush']);
    grunt.registerTask('publish:major', ['clean', 'minify', 'bump:major', 'release', 'nugetpack', 'nugetpush']);
};
