module.exports = function( grunt ) {
  // Load library tasks
  grunt.loadNpmTasks( "grunt-mocha-test" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );

  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),

    jshint: {
      files: [
        "Gruntfile.js",
        "index.js",
        "test/*.js",
        "./*.js"
      ]
    },

    mochaTest: {
      test: {
        options: {
          reporter: "spec",
          timeout: "20000"
        },
        src: [ "./test/test.js" ]
      }
    }
  });

  // Register custom tasks
  grunt.registerTask( "default", [ "jshint", "mochaTest" ]);
};
