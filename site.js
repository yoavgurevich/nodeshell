var request = require( "request" ),
    twitter = require( "twitter" );

module.exports = function( env ){
  var twit = new twitter({
    consumer_key: env.get( "TWIT_CONSUMER_KEY" ),
    consumer_secret: env.get( "TWIT_CONSUMER_SECRET" ),
    access_token_key: env.get( "TWIT_ACCESS_KEY" ),
    access_token_secret: env.get( "TWIT_ACCESS_SECRET" )
  });

  return {
    tweet: function( req, res ) { debugger;
      var tweet = req.body && req.body.message;

      if ( !tweet ) {
        return res.json( 404, { error: "Why didn't you post a message? :(" });
      }

      twit.post( "/statuses/update.json", {
        status: tweet
      }, null, function( data ) {
        res.json( 200, { status: "success" });
      });
    },
  };
};
