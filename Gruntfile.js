// Generated on 2015-08-17 using generator-angular 0.12.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  require('./local.env.js');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn'
  });

/*
  var config = {serverOptions:{},clientOptions:{}};
  var isProduction = grunt.option('isProd');
  process.env.NODE_ENV = isProduction ? 'production' : 'development';

  try {
      config = require('./../server/config/environment');
  } catch(e) {
      config = {};
  }
*/
  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Configuration File
    ngconstant: {
      // Options for all targets
      options: {
        name: 'tunariApp',
        deps: false
      },
      // Environment targets
      generateClientConfig: {
          options: {
              dest: '<%= yeoman.app %>/scripts/config.js'
          },
          constants: {
              Config: {
                  tunariApi: process.env.TUNARI_API                  
              }
          }
      }
    },


    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: process.env.PORT, 
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '*',
        livereload: 35729
      },
      livereload: {
        options: {         
          open: {
                target: 'http://localhost:' + process.env.PORT
          },
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/app/styles',
                connect.static('./app/styles')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
	  build: {
        files: [{
          dot: true,
          src: [
            'build',
          ]
        }]
      },
	  buildTmp: {
        files: [{
          dot: true,
          src: [
            'build/.tmp',
          ]
        }]
      },
      heroku: {
          files: [{
              dot: true,
              cwd: '../server/',
              src: [
                  'config',
                  'logger',
                  'models',
                  'public',
                  'routes',
              ]
          }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      server: {
        options: {
          map: true,
        },
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//
      },
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        ignorePath:  /\.\.\//,
        fileTypes:{
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
              detect: {
                js: /'(.*\.js)'/gi
              },
              replace: {
                js: '\'{{filePath}}\','
              }
            }
          }
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/**/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/images',
          '<%= yeoman.dist %>/styles'
        ],
        patterns: {
          js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
        }
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    ngtemplates: {
      dist: {
        options: {
          module: 'clientApp',
          htmlmin: '<%= htmlmin.dist.options %>',
          usemin: 'scripts/scripts.js'
        },
        cwd: '<%= yeoman.app %>',
        src: 'views/{,*/}*.html',
        dest: '.tmp/templateCache.js'
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      baseFilesToBuild: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: 'build',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
			      'views/{,*/}*.html',
            '*.html',
            'images/{,*/}*.{webp}',
            'styles/fonts/{,*/}*.*',
            'fonts/**/*',
            'images/*',
            'sounds/*' 
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      toServer: {
        expand: true,
        cwd: 'build',
        dest: '../server/public/frontend/',
        src: '**'
      },
      toHeroku: {
          expand: true,
          cwd: '../server/',
          src: [
              'config/**',
              'logger/**',
              'models/**',
              'public/**',
              'routes/**',
              'app.js',
              'package.json',
              'prodStart.js'
          ],
          dest: '../../TunariAppHeroku/servertunari/'
      },
      dependencies: {
        expand: true,
        cwd: 'build/.tmp/',
        dest: 'build/lib/',
        src: 'dependencies.js'
        },     
        styles: {
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          dest: '.tmp/styles/',
          src: '{,*/}*.css'
        }
      },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
	
  //////////////////////////////////////////
  ///////////Added By TerVarSoft////////////
  //////////////////////////////////////////
  
  concat: {
  
		css: {
            src: [        
                    'bower_components/angular-carousel/dist/angular-carousel.css',
                    'bower_components/nya-bootstrap-select/dist/css/nya-bs-select.css',
                    'bower_components/angular-notify/dist/angular-notify.css',
                    'bower_components/angular-material/angular-material.css',
                    'bower_components/angular-material-icons/angular-material-icons.css',
                    'app/custom_dependencies/angular-materialize/angular-materialize-0.97.8.css',
                    'app/custom_dependencies/angular-materialize/material-icons.css',
                    'app/styles/sandstone.css',
                    'app/styles/scrollable-table.css',
                    'app/styles/main.css',                    
                    'app/styles/productsearch.css',    
                    'app/styles/products.css',              
                    'app/styles/sellingItem.css',
                    'app/styles/shoppingcart.css',
                    'app/styles/typeahead.css', 
                    'app/styles/clientsearch.css',
                    'app/styles/clientsamples.css',
                    'app/styles/newclient.css',
                    'app/styles/statistics.css',
                    'app/styles/sellingsCharts.css'
                ],
            dest: 'build/.tmp/app.css'
        },
		
    js: {
        src: [
            'app/scripts/**/*',
            '!app/scripts/config.js'
        ],
        dest: 'build/.tmp/app.js'
    },
		
    /**
     *  Sometimes when there is an error when minifiying, using angular.min.js files
     *  hides the real error in the console, and it just shows an injection problem
     *  making really hard to find the problem.  So, first step when debbuging this
     *  should be to use angular.js instead (without min) and then re-build and then
     *  see if the error changes.
     */
		lib:{
            src: [                                
                'bower_components/jquery/dist/jquery.min.js',
             /*   'bower_components/bootstrap/dist/js/bootstrap.min.js',*/
                'bower_components/angular/angular.min.js',
                'bower_components/angular-notify/dist/angular-notify.min.js',
                'bower_components/angular-animate/angular-animate.min.js',
                'bower_components/angular-route/angular-route.min.js',
                'bower_components/lodash/dist/lodash.min.js',
                'bower_components/restangular/dist/restangular.min.js',
                'bower_components/d3/d3.min.js',
                'bower_components/d3-tip/index.js',
                'bower_components/moment/min/moment.min.js',
                "bower_components/angular-aria/angular-aria.js",
                "bower_components/angular-messages/angular-messages.js",
                "bower_components/angular-material/angular-material.js",
                "bower_components/svg-morpheus/compile/minified/svg-morpheus.js",
                "bower_components/angular-material-icons/angular-material-icons.min.js",
                'app/custom_dependencies/angular-scrollable-table/angular-scrollable-table.min.js',
                'app/custom_dependencies/angular-scrollable-table/angular-locale_es-419.js',
                'app/custom_dependencies/angular-materialize/materialize-0.97.7.min.js',
                'app/custom_dependencies/angular-materialize/angular-materialize-0.2.1.min.js'
            ],
            dest: 'build/.tmp/dependencies.js'
        }
  },
  
  cssmin:{
        css:{
            src: 'build/.tmp/app.css',
            dest: 'build/styles/app.min.css'
        }
    },

    uglify:{
        scripts:{
            files:{
                'build/scripts/app.min.js': ['build/.tmp/app.js'],
//                'build/lib/dependencies.min.js': ['build/.tmp/dependencies.js'],
            }
        }
    },
	
	processhtml:{
        dist:{
            files:{
                'build/index.html': 'app/index.html'
            } 
        }
    }  
	
  });
  
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-ng-constant');

  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {    

    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'ngconstant:generateClientConfig',
      'wiredep',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'wiredep',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
     
  /**
   *  To test without minification, comment the
   *  clean:buildTmp task and copy the files 
   *  in the .tmp folder to the scripts, lib and styles folders. 
   */
  grunt.registerTask('tvsBuild',
    [
      'clean:build',
      'copy:baseFilesToBuild',
      'concat',     
      'cssmin',                     
      'uglify:scripts',
      'copy:dependencies',
      'clean:buildTmp',
      'processhtml',
  ]); 
    
};
