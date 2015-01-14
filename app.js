// External Dependencies (Node core or third-party modules)
var express = require( "express" ),
    path    = require( "path" ),
    body-parser = require( "body-parser" );

// Internal Dependencies (Modules written for this app)
var env = require( "./environment" );

// Instantiate the app
var http = express();

// Conceal the fact we're using nodejs
http.disable( "x-powered-by" );

// Hook up the public directory for static pathing,
// making content in the "public" directory available from
// the root of the server (localhost/etc)
http.use( express.static( path.join( __dirname, "public" ) ) );

http.use( body-parser() );

// Route declaration
http.post( "/", function(req, res) {
  res.send(200, "This is your web server working!");
});

// Start the server
http.listen( env.get( "PORT" ), function() {
  console.log( "HTTP server listening on port " + env.get( "PORT" ) + "." );
});

// FOR MOCHA TESTING:
// If we're running as a child process, let our parent know we're ready.
if ( process.send ) {
  try {
    process.send( "serverStarted" );
  } catch ( e ) {
    // exit the worker if master is gone
    process.exit(1);
  }
}
