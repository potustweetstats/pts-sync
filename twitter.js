const axios = require("axios");

const baseURL = "https://api.twitter.com/1.1/";
const userTimelineURL = baseURL + "statuses/user_timeline.json";
const oauth2TokenURL = 'https://api.twitter.com/oauth2/token';

class TwitterAPI {
    constructor(twitterConfig) {

        // TODO use env
        this.key = twitterConfig.key;
        this.secret = twitterConfig.secret;
    }

    set bearerToken(token) {
        this.bearer_token = token;
    }

    async getBearerToken(){
        console.log("retieving bearer token");
        let auth_token = Buffer.from(this.key + ":" + this.secret).toString('base64');

        return await axios.post(oauth2TokenURL, "grant_type=client_credentials",
            {
                headers: {
                    'authorization': 'Basic ' + auth_token,
                }
            }
        );
    }

    /**
     * 
     * @param {Handle to retrieve tweets for} twitterHandle 
     * @param {Date to pull tweets from. If none, default to oldest date 3/21/2006} fromDate 
     * @param {'next' string from the previous API result} next 
     */
    async getLatestTweets(twitterHandle, fromDate = "200603210000", next) {
        let data = {
            query: `from:${twitterHandle} lang:en`,
            fromDate: fromDate,
            maxResults: "100"
        };

        if (next != undefined && next != "") {
            data.next = next;
        }
        return await axios.post(baseURL + 'tweets/search/fullarchive/ptsdev.json',
            data,
            {
                headers: {
                    'authorization': 'Bearer ' + this.bearer_token,
                    'content-type': 'applications/json'
                }
            });
    }
}

module.exports = {
  TwitterAPI
} 