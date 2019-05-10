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

    copy: {
      main: {
        expand: true,
        src: 'compilados/ejerciciosPilas.js',
        dest: '../public/libs/',
        flatten: true,
        filter: 'isFile'
      },
    },

    ts: {
      default: {
        tsconfig: 'tsconfig.json'
      }
    },

    typescript: {
      base: {
        src: ['src/**/*.ts'],
        dest: 'compilados/ejerciciosPilas.js',
        options: {
          module: 'commonjs',
          target: 'es5',
          rootDir: 'src',
          experimentalDecorators: true,
          emitDecoratorMetadata: true,
          sourceMap: false,
          fullSourceMapPath: false,
          declaration: false,
          comments: true,
        }
      }
    },

    open: {
      dev: {
        path: 'src/visorEjercicios.html'
      }
    },

    watch: {
      scripts: {
        files: ['src/**'],
        tasks: ['compile'],
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

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('copiarPilasBloques', 'copy');
  grunt.registerTask('evaluarTypeScript', 'ts');
  grunt.registerTask('compilarTypeScript', 'typescript');
  grunt.registerTask('compile', ['compilarTypeScript', 'run:compilarGramaticaAleatoria', 'concat', 'copy']);
  grunt.registerTask('default', ['compile']);

  grunt.registerTask('test', 'qunit');
};
