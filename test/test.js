var assert = require( "assert" ),
    expect = require("chai").expect,
    fork = require( "child_process" ).fork,
    uuid = require('uuid'),
    Twitter = require('twitter'),
    request = require( "request" ),
    now = Date.now(),
    env = require( "../environment" ),
    child,
    host = env.get( "HOST" );

/* Twitter API Setup */
var client = new Twitter({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token_key: process.env.TWIT_ACCESS_KEY,
  access_token_secret: process.env.TWIT_ACCESS_SECRET,
});

/**
 * Server functions
 */

function startServer( done ) {
  // Spin-up the server as a child process
  child = fork( "app.js", null, {} );

  // Listen for success, or error with the DB
  child.on( 'message', function( msg ) {
    if ( msg === 'serverStarted' ) {
      return done();
    }

    throw "What happened with the fork?";
  });
  child.on( 'error', function(err) {
    console.error( err );
    child.kill();
  });
}

function stopServer( done ) {
  child.kill();
  done();
}

/**
 * Api functions
 */

function apiHelper( verb, uri, httpCode, data, callback, customAssertions ) {
  // Parameter handling
  if ( typeof( data ) === "function" ) {
    callback = data;
    data = {};
  } else {
    data = data || {};
  }
  callback = callback || function(){};
  customAssertions = customAssertions || function( err, res, body, callback) {
    callback( err, res, body );
  };
  var assertion = function ( err, res, body, callback ) {
    if ( !body ) {
      err = err || "No response body found!";
    }

    assert.ok( !err );
    assert.equal( res.statusCode, httpCode );
    customAssertions( err, res, body, callback );
  };

  request({
    url: uri,
    method: verb,
    json: data
  }, function( err, res, body ) {
    var user;

    if ( err ) {
      return callback( err );
    }

    assertion( err, res, body, callback );
  });
}

/**
 * Unit tests
 */

// Name of the functionality being tested goes here
describe( "The nodeshell's host route ", function() {
  // Logic to run before each test
  before( function( done ) {
    startServer( done );
  });

  // Logic to run after each test
  after( function( done ) {
    stopServer( done );
  });

  // Example test block
  it( 'should return 200 when the root is queried with a get request', function ( done ) {
    apiHelper( 'get', host, 200, done );
  });

  it( 'should return 404 when the root is queried with a post request', function ( done ) {
    apiHelper( 'post', host, 404, done );
  });
});

describe( "The nodeshell's /tweet route", function() {
  // Logic to run before each test
  var uri = "http://localhost:2000/tweet";
  var tid = "";

  before(function(done) {
    startServer( done );
  });

  // Logic to run after each test
  after(function(done) {
    var delRoute = 'statuses/destroy/' + tid + '.json';
    client.post(delRoute, function(error, params, response){
      if(error){
        console.log(error);
        throw error;
      }

      stopServer(done);
    });
  });

  it( 'should return 200 when queried with a post request containing a valid tweet', function ( done ) {
    this.timeout(7000);
    var tweets = {
      tweet: "test" + uuid.v4()
    };

    apiHelper('post', uri, 200, tweets, function(err, res, body){
      expect(err).to.not.exist;
      tid = body.id_str;

      done();
    });
  });
});
