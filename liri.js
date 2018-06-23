// Access the .env file
require("dotenv").config();

// Access the keys.js file and set it to a variable
var keys = require("./keys.js");
var inquirer = require("inquirer");
var twitter = require("twitter");

// Access the keys information
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var inputStr = process.argv;
var action = inputStr[2];

inquirer.prompt([{
    type: "checkbox",
    name: "liriAction",
    message: "Which action would you like to take?",
    choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
  }])
  .then(function (inquirerResponse) {
    if (inquirerResponse.liriAction === "my-tweets") {
      console.log("my-tweets was picked");
    } else if (inquirerResponse.liriAction === "spotify-this-song") {
      console.log("spotify-this-song was picked");
    } else if (inquirerResponse.liriAction === "movie-this") {
      console.log("movie-this was picked");
    } else if (inquirerResponse.liriAction === "do-what-it-says") {
      console.log("do-what-it-says was picked");
    } else {
      console.log("Ok. Come back when you'd like to pick something awesome.")
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