require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
console.log('index is running')

var client = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
});

var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});

var userCommand = process.argv[2]

switch (userCommand) {
  case 'my-tweets':
      getTweets()
    break;
  case 'spotify-this-song':
    querySpotify()
    break;
  case 'movie-this':
    getTweets()
    break;
  case 'do-what-it-says':
    getTweets()
    break;

  default:
  console.log("Sorry i do not recognise that command")
    break;
}


function getTweets() {
  console.log("tweets running");

  let searchString = process.argv[3];
  
  var params = { screen_name: searchString };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    console.log(error)
    if (!error) {
      for(var i = 0; i < tweets.length; i++){
        console.log("==============================");
        console.log("Created At: " + tweets[i].created_at);
        console.log("User: " + tweets[i].user.name);
        console.log("Tweet: " + tweets[i].text);

      }
    }
  });
}

function querySpotify() {

    let searchString = process.argv[3]

    spotify.search({ type: 'track', query: searchString }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }

    var spotifyArray = data.tracks.items;
  for(var i = 0; i < spotifyArray.length; i++) {
    console.log("====================================");
    console.log("Artist: " + spotifyArray[i].album.artists[0].name)
    console.log("Song: " + spotifyArray[i].name);
    console.log("Link to the Song: " + spotifyArray[i].album.artists[0].external_urls.spotify);
    console.log("Album: " + spotifyArray[i].album.name)
  }
 
 
});
}


