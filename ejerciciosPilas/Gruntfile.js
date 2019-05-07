module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    qunit: {
      files: ['test/index.html']
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'dependencias/helpers.js',
          'dependencias/listHelper.js',
          'node_modules/nearley/lib/nearley.js',
          'compilados/gramaticaAleatoria.js',
          'compilados/ejerciciosPilas.js',
        ],
        dest: 'compilados/ejerciciosPilas.js',
      },
    },

    ts: {
      default: {
        tsconfig: 'tsconfig.json'
      }
    },

    open: {
      dev: {
        path: 'src/visorEjercicios.html'
      }
    },

    run: {
      compilarGramaticaAleatoria: {
        cmd: 'npm',
        args: [
          'run',
          'compilarGramaticaAleatoria'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('default', ['ts', 'run:compilarGramaticaAleatoria', 'concat']);

  grunt.registerTask('test', 'qunit');
};
