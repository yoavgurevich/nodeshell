var Twitter = require('twitter');
var http = require('./app');
var request = require('request');

var client = new Twitter({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token_key: process.env.TWIT_ACCESS_KEY,
  access_token_secret: process.env.TWIT_ACCESS_SECRET,
});

http.post( "/tweet", function(req, res) {
  client.post('statuses/update', {status: req.body.tweet},  function(error, params, response){
    if(error){
      console.log(error);
      throw error;
    }

    res.status(200).send(params);
  });
});
