'use strict';
var LIVERELOAD_PORT = 35729;

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        distdir: 'dist',
        srcdir: 'src',
        clean: ['<%= distdir %>/*'],
        banner: "/*! On Screen Keyboard written in vanilla JS*/\n",
        copy: {
            css: {
                files: [{
                    expand: true,
                    cwd: '<%= srcdir %>/css/*.css',
                    src: ['**/*'],
                    dest: '<%= distdir %>/css/'
                }]
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
        }
    });

    grunt.registerTask('default', function(target) {
        grunt.task.run([
            'clean',
            'concat:js',
            'copy'
        ]);
    });
};
