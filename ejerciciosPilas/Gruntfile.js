
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
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
            '../pilasweb/public/pilasweb.js',
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
          basePath: 'src',
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
        tasks: ['clear', 'typescript', 'concat'],
      }
    },
    open: {
        dev: {
            path: 'src/visorEjercicios.html'
        }
    },
    shell: {
    	compilarCabecerasPilas: {
    		command: ['cd ../pilasweb/', 'grunt', 'tsc -d -t ES5 --out pilasweb.d.ts **/*.ts'].join('&&')
    	},
    	copiarCabecerasPilas: {
		command: 'mv ../pilasweb/pilasweb.d.ts dependencias/pilasweb.d.ts'
	},
	clear: {
		command: 'clear'
	}
    }
  });

  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('clear', ['shell:clear']);
  
  grunt.registerTask('pilas', ['compilarCabecerasPilas', 'copiarCabecerasPilas']);
  
  grunt.registerTask('compilarCabecerasPilas', ['shell:compilarCabecerasPilas']);

  grunt.registerTask('copiarCabecerasPilas', ['shell:copiarCabecerasPilas']);
  
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['typescript', 'concat', 'open']);

  // Load the task
  grunt.loadNpmTasks('grunt-notify');
  // This is required if you use any options.
  grunt.task.run('notify_hooks');
};
