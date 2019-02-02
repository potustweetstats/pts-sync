const config = require('config');
const Presidents = config.get('Presidents');
let President = require('./president');
let { TwitterAPI } = require('./twitter');
const Database = require('./db');

let twitter = new TwitterAPI(config.get("Twitter"));
let db = new Database(config.get("DB"));
let presidents = config.get("Presidents");

(async() => {

    // get the bearer token
    let bearerToken = await db.getTwitterBearerToken();
    if (bearerToken == "") {
        bearerToken = twitter.getBearerToken()
    }
    twitter.bearerToken = bearerToken;
    console.log("Bearer Token: " + bearerToken);

    for (let i = 0; i < presidents.length; i++) {
        president = presidents[i];
        console.log("president: " + president);
    }
    try {
        let apiResponse = await twitter.getLatestTweets('bearcherian')
        let tweets = apiResponse.data.results;
        for (let i = 0; i < tweets.length; i++) {
            await db.addTweet(tweets[i]);
        }
    } catch(err) {
        console.log("Could not process tweets");
        console.log(err.response.data);
    } finally {
        console.log("shutting down");
        await db.close()
    }

    // syncTweets('bearcherian')
    setTimeout(async () => {
        
    },5000);
    
})();

console.log("done");
return;

console.log("why are you here?");
twitter.getLatestTweets('bearcherian').then(function(response){
    console.log(response);
    let results = response.data.results;
    results.forEach(async (tweet) => {
        await db.addTweet(tweet);
    })
}).then(function(){
    console.log("shutting down");
    db.close()
}).catch(function(error){
    console.log(error);
    console.log(error.response.data);
})

async function syncTweets(twitterHandle) {
    console.log("Syncing " + twitterHandle);

    twitter.getLatestTweets(twitterHandle, "");
}

async function addTweets(tweets, callback) {
    for (let i = 0; i < tweets.length; i++) {
        console.log("tweet " + i);
        await callback(tweets[i]);
    }
}

// .then(function(response){
    
// }).catch(function(error){
//     console.error("ERROR");
//     console.error(error.response.data);
// })

// let response = await twitter.getLatestTweet('bearcherian');
// console.log(response);

// Presidents.forEach(function(president, idx){
//     let pres = new President(president);
//     console.log("President " + idx);
//     console.log(president);
//     console.log(pres.name);
// })

// load configs

// load handles

// connect to db

// initialize twitter

// for each handle
    // find the oldest tweet date

    // load tweets starting from the oldest date to now

    // listen (rpc?) for new tweets
// end for