var assert = require( "assert" ),
    fork = require( "child_process" ).fork,
    request = require( "request" ),
    now = Date.now(),
    env = require( "../environment" ),
    child,
    host = env.get( "HOST" );

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

describe( "Name of the functionality being tested goes here", function() {
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
});

