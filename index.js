// Added require files
require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');
var yesno = require('yesno');

// Added twitter client from twitter npm documentation
var client = new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});

// Added Spotify Client from Spotify npm documentation
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

// Created a variable for the user input. This is used to trigger API calls and functions
var userCommand = process.argv[2];

// Created a function to treat any user input after the userCommand variable as one continuous string
// 
function getSearchString(checkFirst, param2) {

    if (checkFirst) {
        switch (param2) {
            case "my-tweets":
                getTweets(checkFirst)
                break;

            case "spotify-this-song":
                querySpotify(checkFirst)
                break;

            case "movie-this":
                movie(param2);
                break;

            default:
                console.log("Sorry, please try again")
                break;
        }

    } else {
        var searchString = "";

        for (var i = 3; i < process.argv.length; i++) {
            searchString += process.argv[i] + " ";
        }
        return searchString;

    }


};

// Created a user prompt function that will console log the various commands and functionalities of this program
function userPrompt() {
    console.log("Please search for a Twitter profile - 'my-tweets'");
    console.log("Song - 'spotify-this-song'");
    console.log("Or Movie - 'movie-this'");
    console.log("Additionally, you can clear the log or master file using 'clear-log' or 'clear-master'");
}

// Created a switch to evaluate the userCommand and make API or function calls
// With the three APIs I created an If statement that triggers a default search
// if no search string in provided by the user, a search string will be passed in

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

            // Created two additional functions to clear the log or the master file

        case 'clear-log':
            logTransfer()
             setTimeout(function() {
            clearLog("log.txt")
            }, 3000);
            // clearLog("log.txt")
            break;

        case 'clear-master':
            clearMaster()
            break;

        default:
            console.log("Sorry I do not recognize that command")
            userPrompt()
            break;
    }
};

// If statement to check if userCommand exists. If no user input is recieved it will trigger a prompt function

if (userCommand) {
    userChoice(userCommand);
} else {
    userPrompt();
};


// Function to call twitter API, argument twitter handle being passed in searches for a specific twitter account
function getTweets(twitterHandle) {
    var params = { screen_name: twitterHandle };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {

            // Created empty array to use for both console logging and appending to the log.txt file
            var tweetsArray = [];

            // Iterate over tweets array to push to my empty array the following object key value pairs
            for (var i = 0; i < tweets.length; i++) {

                tweetsArray.push("==============================");
                tweetsArray.push("Created At: " + tweets[i].created_at);
                tweetsArray.push("User: " + tweets[i].user.name);
                tweetsArray.push("Tweet: " + tweets[i].text);
            }

            // Iterate over my array to console log and append/write to my log.txt file
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
};


// Function to call spotify API
function querySpotify(song) {


    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // Created empty array to use for both console logging and appending to the log.txt file
        var spotifyLog = [];
        var spotifyArray = data.tracks.items;

        // Iterate over spotify array to push to my empty array the following object key value pairs
        for (var i = 0; i < spotifyArray.length; i++) {
            spotifyLog.push("====================================");
            spotifyLog.push("Artist: " + spotifyArray[i].album.artists[0].name)
            spotifyLog.push("Song: " + spotifyArray[i].name);
            spotifyLog.push("Link to the Song: " + spotifyArray[i].album.artists[0].external_urls.spotify);
            spotifyLog.push("Album: " + spotifyArray[i].album.name)
        }

        // Iterate over my array to console log and append/write to my log.txt file
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
};

// Function to call OMDB API

function movie(movieSearch) {


    var queryUrl = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&apikey=trilogy"

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var movieObj = JSON.parse(body);

            // Since an object was returned, I didn't need to push to an empty array
            // Instead I could create my array and add the key value pairs I needed
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

            // Iterate over my array to console log and append/write to my log.txt file
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
    });
};

// Function to read from random.txt and call the corresponding function (getTweets, querySpotify, or movie)
function doWhat() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Split array by commas (to make it more readable)
        var dataArr = data.split(",");

        getSearchString(dataArr[1], dataArr[0]);
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
    // setTimeout(function() {
    //     clearLog("log.txt")
    // }, 3000);
    
}

function clearLog(log) {

    // logTransfer();

    fs.writeFile(log, log + " Cleared at " + new Date(), function(err) {

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
        if (ok) {
            // logTransfer();
            clearLog("masterFile.txt");          


        } else {
            console.log("Nothing changed");
            console.log("Press Ctrl + C to continue");
        }
    });

}