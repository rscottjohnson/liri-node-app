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
var fs = require("fs"); // reading / writing files

// Boolean value to initiate or skip inquirer prompts
var dwis = false;

// FUNCTIONS
//====================

// Execute a twitter search for the given screen_name
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
  if (dwis === false) {
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
          var songSearch = "";

          if (songAns.songName.length < 1) {
            songSearch = "Ace of Base The Sign";
          } else {
            songSearch = songAns.songName;
          }

          var spotify = new Spotify(keys.spotify);

          spotify.search({
            type: 'track',
            query: songSearch,
            // query: songAns.songName,
            // limit: 5
          }, function (err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            // console.log(songSearch);
            // console.log(JSON.stringify(data, null, 2));
            for (var i = 0; i < data.tracks.items.length; i++) {
              console.log("\n===============================\n")
              console.log("Song information from Spotify:")
              console.log("\n===============================\n")
              console.log("ARTIST: " + data.tracks.items[i].artists[0].name);
              console.log("SONG TITLE: " + data.tracks.items[i].name);
              console.log("PREVIEW LINK: " + data.tracks.items[i].preview_url);
              console.log("ALBUM NAME: " + data.tracks.items[i].album.name);
            }
          });
        } else {
          console.log("\nThat's okay.  Come again when you are more sure.\n");
        }
      });
  } else {
    var spotify = new Spotify(keys.spotify);

    fs.readFile("random.txt", "utf8", function (error, data) {

      if (error) {
        return console.log(error);
      }
      // Print the contents of data
      // console.log(data);
      // Then split it by commas (to make it more readable)
      var dataArr = data.split(",");

      var songSearch = dataArr[1];

      spotify.search({
        type: 'track',
        query: songSearch
        // query: songAns.songName,
        // limit: 5
      }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        // console.log(songSearch);
        // console.log(JSON.stringify(data, null, 2));
        for (var i = 0; i < data.tracks.items.length; i++) {
          console.log("\n===============================\n")
          console.log("Song information from Spotify:")
          console.log("\n===============================\n")
          console.log("ARTIST: " + data.tracks.items[i].artists[0].name);
          console.log("SONG TITLE: " + data.tracks.items[i].name);
          console.log("PREVIEW LINK: " + data.tracks.items[i].preview_url);
          console.log("ALBUM NAME: " + data.tracks.items[i].album.name);
        }
      });
    });
  }
}

function omdb() {
  if (dwis === false) {
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

          var movieSearch = "";

          if (movieAns.movieName.length < 1) {
            movieSearch = "Mr. Nobody";
          } else {
            movieSearch = movieAns.movieName;
          }

          // Request to the OMDB API
          var queryUrl = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&tomatoes=true&apikey=trilogy";

          // Need to add something to default to "Mr. Nobody" if no song name is provided

          request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
              console.log("\n===============================\n")
              console.log("Movie information from OMDB:")
              console.log("\n===============================\n")
              console.log("MOVIE TITLE: " + movieSearch);
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
  } else {
    fs.readFile("random.txt", "utf8", function (error, data) {

      if (error) {
        return console.log(error);
      }
      // Print the contents of data
      // console.log(data);
      // Then split it by commas (to make it more readable)
      var dataArr = data.split(",");

      var movieSearch = dataArr[1];

      // Request to the OMDB API
      var queryUrl = "http://www.omdbapi.com/?t=" + movieSearch + "&y=&plot=short&tomatoes=true&apikey=trilogy";

      // Need to add something to default to "Mr. Nobody" if no song name is provided

      request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
          console.log("\n===============================\n")
          console.log("Movie information from OMDB:")
          console.log("\n===============================\n")
          console.log("MOVIE TITLE: " + movieSearch);
          console.log("RELEASE YEAR: " + JSON.parse(body).Year);
          console.log("IMDB RATING: " + JSON.parse(body).imdbRating);
          console.log("ROTTEN TOMATOES RATING: " + JSON.parse(body).Ratings[1].Value);
          console.log("COUNTRY: " + JSON.parse(body).Country);
          console.log("LANGUAGE: " + JSON.parse(body).Language);
          console.log("PLOT: " + JSON.parse(body).Plot);
          console.log("ACTORS: " + JSON.parse(body).Actors);
        }
      });
    });
  }
}

function dWIS() {
  fs.readFile("random.txt", "utf8", function (error, data) {

    if (error) {
      return console.log(error);
    }

    // Print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");
    if (dataArr[0] == 'my-tweets') {
      tweets();
    } else if (dataArr[0] == 'spotify-this-song') {
      dwis = true;
      spotThisSong();
    } else if (dataArr[0] == 'movie-this') {
      dwis = true;
      omdb();
    } else {
      console.log("Please set the first argument in random.txt to my-tweets, spotify-this-song, or movie-this.");
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
      dwis = false;
      spotThisSong();
    } else if (user.liriAction == "Movie") {
      dwis = false;
      omdb();
    } else if (user.liriAction == "Do what it says") {
      dWIS();
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