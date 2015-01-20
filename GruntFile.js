var grunt = require('grunt');

grunt.initConfig({
  nodewebkit: {
    options: {
      platforms: ['win32','osx32'],
      build_dir: './distribuibles',
    },
    src: ['./dist/**/*',
          'node_modules/nedb/**/*',
    ]
  },
});

grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-node-webkit-builder');
