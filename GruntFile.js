module.exports = function(grunt) {

grunt.initConfig({
  nodewebkit: {
    options: {
      version: '0.8.6',
      build_dir: './distribuibles',
      mac: true,
      win: false,
      linux32: false,
      linux64: false
    },
    src: [
    './dist/**/*',
    ]
  },
  copy: {
    main: {
      files: [
      {expand: true, src: ['./pilasweb/public/pilasweb.js'], dest: 'public/libs/', flatten: true},
      {expand: true, src: ['./pilasweb/public/data/*'], dest: 'public/libs/data/', flatten: true},
      ],
    },
  },
});

grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-node-webkit-builder');
}
