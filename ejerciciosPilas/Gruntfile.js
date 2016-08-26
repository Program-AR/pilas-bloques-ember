module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    notify_hooks: {
                    options: {
                               enabled: true,
                               max_jshint_notifications: 5,
                               success: false,
                               duration: 3
                             }
    },
    qunit: {
      files: ['test/index.html']
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
            'dependencias/listHelper.js',
            'compilados/ejerciciosPilas.js',
        ],
        dest: 'compilados/ejerciciosPilas.js',
      },
    },

    typescript: {
      base: {
        src: ['src/**/*.ts'],
        dest: 'compilados/ejerciciosPilas.js',
        options: {
          module: 'commonjs',
          target: 'es5',
          rootDir: 'src',
          sourceMap: false,
          fullSourceMapPath: false,
          declaration: false,
          comments: true,
          }
        }
      },
    watch: {
      scripts: {
        files: ['src/**'],
        tasks: ['typescript', 'concat'],
      }
    },
    open: {
        dev: {
            path: 'src/visorEjercicios.html'
        }
    },
  });

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', ['typescript', 'concat']);

  grunt.loadNpmTasks('grunt-notify');
  grunt.task.run('notify_hooks');
  grunt.registerTask('test', 'qunit');
};
