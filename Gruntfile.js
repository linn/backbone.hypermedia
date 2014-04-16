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
            all: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js']
        },

        clean: ['nuget/*.nupkg'],

        release: {
            options: {
                bump: false, // use grunt-bump for this as it can reload pkg
                add: false,
                commit: false,
                tag: false,
                push: false,
                pushTags: false
            }
        },

        bump: {
            options: {
                updateConfigs: ['pkg'],
                commit: false,
                createTag: false,
                push: false
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

    grunt.registerTask('test', ['jshint', 'jasmine']);
    grunt.registerTask('default', ['test']);
    grunt.registerTask('publish', ['publish:patch']);
    grunt.registerTask('publish:patch', ['clean', 'bump', 'release:patch', 'nugetpack', 'nugetpush']);
    grunt.registerTask('publish:minor', ['clean', 'bump', 'release:minor', 'nugetpack', 'nugetpush']);
    grunt.registerTask('publish:major', ['clean', 'bump', 'release:major', 'nugetpack', 'nugetpush']);
};
