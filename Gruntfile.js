module.exports = function(grunt) {
  
  var env      = process.env.NODE_ENV || "development";
  var DBconfig = require('./db.config.json')[env];
  var db = DBconfig.protocol +
    '://' + DBconfig.username + 
    ':'   + DBconfig.password + 
    '@'   + DBconfig.host + 
    ':'   + DBconfig.port  + 
    '/'   + DBconfig.database;
       
  var gruntConfig = {
    pkg    : grunt.file.readJSON('package.json'),
    jshint : {
      files   : [
        'api/**/*.js' 
        ],
      options : {
        'force'    : true,
        'validthis': true,
        'laxcomma' : true,
        'laxbreak' : true,
        'browser'  : true,
        'eqnull'   : true,
        'debug'    : true,
        'devel'    : true,
        'boss'     : true,
        'expr'     : true,
        'asi'      : true,
        'sub'      : true
      }
    },
    watch : {
      files   : [
        'api/**/*.js', 
        'db.config.json', 
        'deployment.environments.json', 
        'Gruntfile.js'
      ],
      tasks   : ['develop'],
      options : { nospawn: true, atBegin: true }
    },

    develop : {
      server : {
        file : 'api/app.js',
        args : ['debug'] 
      }
    },
    "couch-compile": {
      app: {
        files: {
          "db/designdoc.json": "db/design/*"
        }
      }
    },
    "couch-push": {   
      options : {
        user : DBconfig.username,
        pass : DBconfig.password, 
      },
      localhost : {
        files : {}
      }
    }     
    
  };
  
  
  gruntConfig["couch-push"].localhost.files[db] = "db/designdoc.json";
  grunt.initConfig(gruntConfig);
  
  grunt.loadNpmTasks('grunt-npm-install');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-develop');
  grunt.loadTasks('./node_modules/grunt-couch/tasks');
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('updateViews', ['couch-compile', 'couch-push']);
};
