// JavaScript for client side stuff goes here
var tweets = {
  tweet: ""
};

$(document).ready(function() {
  $('#tweetpost').on('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key == 13) {
      tweets.tweet =  $("#tweetpost").val();
      $.ajax({
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        url: "http://localhost:2000/tweet",
        data: JSON.stringify(tweets)
      }).done(function() {
        $('#history').append('<li>' + tweets.tweet + '</li>');
        return console.log('upvotes for you precious, it worked');
      });
    }
  });
});
