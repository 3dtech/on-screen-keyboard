'use strict';
var LIVERELOAD_PORT = 35729;

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-webpack');

    grunt.initConfig({
        distdir: 'dist',
        srcdir: 'src',
        clean: ['<%= distdir %>/*'],
        banner: "/*! On Screen Keyboard written in vanilla JS*/\n",
        copy: {
            css: {
                files: [ { src: './<%= srcdir %>/css/*.css', dest: './<%= distdir %>/css/', filter: 'isFile', flatten: true, expand: true} ]
            }
        },
        concat: {
            js: {
                options: {
                    banner: "<%= banner %>"
                },
                src: ['<%= srcdir %>/*.js'],
                dest: '<%= distdir %>/keyboard.js'
            }
        },
        uglify: {
            options: {
                mangle: false,
                compress: {
                    drop_console: true
                }
            }
        },
        webpack: {
            default: {
                entry: './index.js',
                output: {
                    filename: 'osk.esm.js',
                }
            },
            common: {
                entry: './index.js',
                output: {
                    filename: 'osk.common.js',
                    library: 'OSK',
                    libraryTarget: 'commonjs2',
                    libraryExport: 'OSK',
                }
            },
            library: {
                entry: './index.js',
                output: {
                    filename: 'osk.min.js',
                    library: 'OSK',
                    libraryTarget: 'var'
                }
            },
            dist: {
                entry: './index.js',
                output: {
                    filename: 'osk.js',
                    library: 'OSK',
                    libraryTarget: 'var'
                },
                optimization: {
                    minimize: false
                }
            }
        }
    });

    grunt.registerTask('debug', function(target) {
        grunt.task.run([
            'webpack',
            'copy:css'
        ]);
    });

    grunt.registerTask('default', function(target) {
        grunt.task.run([
            'clean',
            'webpack',
            'copy:css'
        ]);
    });
};
