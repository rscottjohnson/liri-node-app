// Access the .env file
require("dotenv").config();

// VARIABLES
//====================

// Access the keys.js file and set it to a variable
var keys = require("./keys.js");

// Require the npm pakages
var inquirer = require("inquirer");
var moment = require("moment");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require("request"); // OMDB API

// FUNCTIONS
//====================

function tweets() {
  var client = new Twitter(keys.twitter);

  var params = {
    screen_name: 'FauxScoJo',
    count: 20
  };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (error) {
      console.log(error);
    }
    console.log("\n===============================\n")
    console.log("Here is a listing of tweets:")
    console.log("\n===============================\n")
    for (var i = 0; i < params.count; i++) {
      console.log((i + 1) + ". Created: " + moment(tweets[i].created_at, "dd MMM DD HH:mm:ss ZZ YYYY", "en").format("MMMM Do YYYY, h:mm a") + " | " + tweets[i].text);
    }
  });
}

function spotThisSong() {
  inquirer.prompt([{
        type: "input",
        message: "Type the name of the song: ",
        name: "songName"
      },
      {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
      }
    ])
    .then(function (songAns) {
      if (songAns.confirm) {

        var spotify = new Spotify(keys.spotify);

        // Need to add something to default to "The Sign" if no song name is provided

        spotify.search({
          type: 'track',
          query: songAns.songName,
          limit: 1
        }, function (err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          // console.log(JSON.stringify(data, null, 2));
          console.log("\n===============================\n")
          console.log("Song information from Spotify:")
          console.log("\n===============================\n")
          console.log("ARTIST: " + data.tracks.items[0].artists[0].name);
          console.log("SONG TITLE: " + data.tracks.items[0].name);
          console.log("PREVIEW LINK: " + data.tracks.items[0].preview_url);
          console.log("ALBUM NAME: " + data.tracks.items[0].album.name);
        });
      } else {
        console.log("\nThat's okay.  Come again when you are more sure.\n");
      }
    });
}

function omdb() {
  inquirer.prompt([{
        type: "input",
        message: "Type the name of the movie: ",
        name: "movieName"
      },
      {
        type: "confirm",
        message: "Are you sure:",
        name: "confirm",
        default: true
      }
    ])
    .then(function (movieAns) {
      if (movieAns.confirm) {

        // Request to the OMDB API
        var queryUrl = "http://www.omdbapi.com/?t=" + movieAns.movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

          // If the request is successful
          if (!error && response.statusCode === 200) {
            console.log("\n===============================\n")
            console.log("Movie information from OMDB:")
            console.log("\n===============================\n")
            console.log("RELEASE YEAR: " + JSON.parse(body).Year);
            console.log("IMDB RATING: " + JSON.parse(body).imdbRating);
            console.log("ROTTEN TOMATOES RATING: " + JSON.parse(body).Ratings[1].Value);
            console.log("COUNTRY: " + JSON.parse(body).Country);
            console.log("LANGUAGE: " + JSON.parse(body).Language);
            console.log("PLOT: " + JSON.parse(body).Plot);
            console.log("ACTORS: " + JSON.parse(body).Actors);
          }
        });
      }
    });
}

// MAIN PROCESS
//====================

inquirer.prompt([{
    type: "checkbox",
    message: "Which action would you like to take?",
    choices: ["Tweets", "Spotify", "Movie", "Do what it says"],
    name: "liriAction"
  }])
  .then(function (user) {
    if (user.liriAction == "Tweets") {
      tweets();
    } else if (user.liriAction == "Spotify") {
      spotThisSong();
    } else if (user.liriAction == "Movie") {
      omdb();
    } else if (user.liriAction == "do-what-it-says") {
      console.log("do-what-it-says was picked");
    } else {
      console.log("Ok. Come back when you'd like to pick something awesome.");
    }
  });

// switch (action) {
//   case "my-tweets":
//   myTweets();
//   break;

//   case "spotify-this-song":
//   spotThisSong();
//   break;

//   case "movie-this":
//   movieThis();
//   break;

//   case "do-what-it-says":
//   dwiSays();
//   break;
// }

// // If the my-tweets action
// function myTweets() {

// }

// function spotThisSong() {

// }

// function movieThis() {

// }

// function dwiSays() {

// }