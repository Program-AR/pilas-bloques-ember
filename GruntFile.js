module.exports = function(grunt) {

grunt.initConfig({
  nodewebkit: {
    options: {
      version: '0.11.3',
      build_dir: './distribuibles',
      mac: true,
      win: false,
      linux32: false,
      linux64: false
    },
    src: ['./dist/**/*',
          'node_modules/nedb/**/*',
    ]
  },
});

grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-node-webkit-builder');
}
