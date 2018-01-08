// 

require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');
var yesno = require('yesno');
// console.log('index is running');

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

var userCommand = process.argv[2];

function getSearchString() {

    var searchString = "";

    for (var i = 3; i < process.argv.length; i++) {
        searchString += process.argv[i] + " ";
    }
    return searchString;
}

function userChoice(caseType) {
    switch (caseType) {
        case 'my-tweets':
            if (process.argv[3] === undefined) {
                getTweets("realdonaldtrump");
            } else {
                getTweets(getSearchString());
            }

            break;
        case 'spotify-this-song':
            if (process.argv[3] === undefined) {
                querySpotify("I want it that way");
            } else {
                querySpotify(getSearchString());
            }

            break;
        case 'movie-this':
            if (process.argv[3] === undefined) {
                movie("Mr. Nobody");
            } else {
                movie(getSearchString());
            }
            break;
        case 'do-what-it-says':
            doWhat()
            break;

        case 'clear-log':
            logTransfer()
            clearLog("log.txt")
            break;

        case 'clear-master':
            clearMaster();

            break;

        default:
            console.log("Sorry i do not recognise that command")
            break;
    }


}

if (userCommand) {
    userChoice(userCommand);
}



function getTweets(twitterHandle) {
    // console.log("tweets running");
    var params = { screen_name: twitterHandle };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        // console.log(error)
        if (!error) {

            var tweetsArray = [];
            for (var i = 0; i < tweets.length; i++) {

                tweetsArray.push("==============================");
                tweetsArray.push("Created At: " + tweets[i].created_at);
                tweetsArray.push("User: " + tweets[i].user.name);
                tweetsArray.push("Tweet: " + tweets[i].text);
            }

            for (var y = 0; y < tweetsArray.length; y++) {
                fs.appendFile("log.txt", tweetsArray[y] + "\n", function(err) {
                    // If the code experiences any errors it will log the error to the console.
                    if (err) {
                        return console.log(err);
                    }
                });
                console.log(tweetsArray[y]);
            }
        }
    });
}

function querySpotify(song) {


    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var spotifyLog = [];
        var spotifyArray = data.tracks.items;
        for (var i = 0; i < spotifyArray.length; i++) {
            spotifyLog.push("====================================");
            spotifyLog.push("Artist: " + spotifyArray[i].album.artists[0].name)
            spotifyLog.push("Song: " + spotifyArray[i].name);
            spotifyLog.push("Link to the Song: " + spotifyArray[i].album.artists[0].external_urls.spotify);
            spotifyLog.push("Album: " + spotifyArray[i].album.name)
        }

        for (var y = 0; y < spotifyLog.length; y++) {
            fs.appendFile("log.txt", spotifyLog[y] + "\n", function(err) {
                // If the code experiences any errors it will log the error to the console.
                if (err) {
                    return console.log(err);
                }
            });
            console.log(spotifyLog[y]);

        }




    });
}

function movie(movieSearch) {


    var queryUrl = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy"

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieObj = JSON.parse(body);


            var movieLogArry = [
                "=================================",
                new Date(),
                "Title: " + movieObj.Title,
                "Year: " + movieObj.Year,
                "Rating: " + movieObj.Rated,
                "Rotten Tomatoes: " + movieObj.Ratings[1].Value,
                "Country: " + movieObj.Country,
                "Language: " + movieObj.Language,
                "Plot: " + movieObj.Plot,
                "Actors: " + movieObj.Actors
            ];

            for (var i = 0; i < movieLogArry.length; i++) {
                fs.appendFile("log.txt", movieLogArry[i] + "\n", function(err) {

                    // If the code experiences any errors it will log the error to the console.
                    if (err) {
                        return console.log(err);
                    }
                });

                console.log(movieLogArry[i]);
            }




        }
    })

}

function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // We will then print the contents of data
        // console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        // console.log(dataArr);

        userChoice(dataArr[0]);

    });

}

function logTransfer() {
    fs.readFile("log.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

       
        // Then split it by commas (to make it more readable)
        var dataArr = data.split("\n");

        // We will then re-display the content as an array for later use.
        // console.log(dataArr);

        for (var x = 0; x < dataArr.length; x++) {
            fs.appendFile("masterFile.txt", dataArr[x] + "\n", function(err) {

                // If the code experiences any errors it will log the error to the console.
                if (err) {
                    return console.log(err);
                }
            });

        }


    });
}

function clearLog(log) {

    // logTransfer();

    fs.writeFile(log , log + " Cleared at " + new Date(), function(err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }

        // Otherwise, it will print: "movies.txt was updated!"
        console.log(log + " cleared at " + new Date());
        if (log === "masterFile.txt") {
            console.log("Press Ctrl + C to continue");
        }

    });


}

function clearMaster() {
    yesno.ask('This cannot be undone. Are you sure you want to continue?', true, function(ok) {
    if(ok) {        
        clearLog("masterFile.txt");    
      

    } else {
        console.log("Nothing changed");
        console.log("Press Ctrl + C to continue");
    }
});

}

