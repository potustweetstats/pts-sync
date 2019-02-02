const {Pool}  = require('pg');

/**
 * this could be done better
 */
module.exports = class Database {

    /**
     * 
     * @param {object} DBConfig 
     */
    constructor(DBConfig) {
        this.pool = new Pool(DBConfig);
    }

    async close() {
        return await this.pool.end();
    }

    async saveAppConfig(name, value) {
        let sql = "INSERT INTO app_config (name, value) VALUES ($1, $2)"
        return await this.pool.query(sql, [name, value])
    }

    async addTweet(tweet) {
        // console.log("adding " + tweet.id + "...");
        let date = Date.parse(tweet.created_at) / 1000.0;
        let values = [tweet.id, tweet.user.id, tweet.user.screen_name, tweet.text, date, tweet.source, tweet.in_reply_to_status_id, tweet.in_reply_to_user_id, tweet.quoted_status_id];
        // console.log(values)
        let results = await this.pool.query(
            'INSERT INTO tweets(id, user_id, screen_name, text, created_at, source, in_reply_to_status_id, in_reply_to_user_id, quoted_status_id) VALUES ($1, $2, $3, $4, to_timestamp($5), $6, $7, $8, $9) ON CONFLICT DO NOTHING',
            values);
        return results;
    }

    async getTwitterBearerToken() {
        let results = await this.pool.query("SELECT value FROM app_config WHERE app_config.name = 'tw_bearer_token'");
        console.log("rows: " + results.rows.length);
        console.log(results.rows[0]);
        if (results.rows.length > 0) {
            return results.rows[0].value;
        } 
        return "";
    }

    async getLatestTweetDate(twitterHandle) {
        return await this.pool.query('SELECT date FROM tweets WHERE handle = $1 ORDER BY date DESC LIMIT 1', twitterHandle)
    }

}