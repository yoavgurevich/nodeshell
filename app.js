// External Dependencies (Node core or third-party modules)
var express = require( "express" ),
    path    = require( "path" ),
    bodyParser = require( "body-parser" );

// Internal Dependencies (Modules written for this app)
var env = require( "./environment" );

// Instantiate the app
var http = express();

// Conceal the fact we're using nodejs
http.disable( "x-powered-by" );

// Set up middleware to hook up the public directory for static pathing,
// making content in the "public" directory available from
// the root of the server
http.use( express.static( path.join( __dirname, "public" ) ) );

// Set up middleware to parse request bodies for us.
http.use( bodyParser.json() );

// Route declaration
http.get( "/example", function(req, res) {
  res.status( 200 ).send( "This is your web server working!" );
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
