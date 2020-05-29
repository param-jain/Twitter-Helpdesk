const Twitter = require('twitter');
var express = require("express");
var bodyParser = require("body-parser");
module.exports = (app, io) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    // Will be stored in Environment Variable in Production Code
    let twitter = new Twitter({
        consumer_key: 'u5h3Mu4EVEOeatsJCdkAWb2ip',
        consumer_secret: 'tnRS7uqqV94EiyJOisxG9lnMYXOL5DzdysuhSsY7p69I6HVKGE',
        access_token_key: '1261945541346250753-yXaoLq5mmLrMv4a4P9pdI5cVOy4EoG',
        access_token_secret: 'xXE3zmpOKWGglcNGcDvExhnT1VVguV3Tthx7Ud3BtZuY8' 
    });
    //let socketConnection;
    let twitterStream;
    let gSocket;
    let focusedReplies;

    app.locals.searchTerm = 'amazonIN';
    app.locals.showRetweets = false;
    app.locals.focusedTweet = ''

    const sendMessage = (lmsg, socket) => {
        if (lmsg.text.includes('RT')) {
            return;
        }
        console.log(lmsg);
        var feed = focusedReplies;
        var comments = [];
        for (var index = 0; index < feed.statuses.length; index++) {
            if (feed.statuses[index].in_reply_to_status_id_str === app.locals.focusedTweet.tweetStrId) {
                comments.push(feed.statuses[index]);
            }
        }
        let msg = {
            tweets: lmsg, replies: comments
        }
        socket.emit("tweets", msg);
    }

    function postAnUpdate(tweetStrId, screenName, msg, cb) {
        console.log('Posting an Update for TweetId ' + tweetStrId);
        twitter.post('statuses/update', {
            status: '@' + screenName + ' ' + msg,
            in_reply_to_status_id: tweetStrId
        }, function(error, tweet, response) {
            if(error) {
                console.log(error);
                return cb(error);
            }
            console.log('Tweet Posted Successfully!');
            return cb(tweet);
        });
    }

    function getAllReplies(tweetStrId, screenName, cb) {
        console.log('Fetching List of Replies for TweetId: ' + tweetStrId);
        twitter.get('search/tweets', {
            'q': 'to:' + screenName,
            'count': 100,
            'result_type': 'mixed',
            'include_entities': true,
            'since_id': tweetStrId
        }, function(error, tweets, response) {
            if(error) {
                console.log('Fetching List of Replies Error: ' + error);
                return cb(error);
            }
            return cb(tweets);
         })
    }

    const stream = (socket) => {
        console.log('Resuming for Search Term: ' + app.locals.searchTerm);
        twitter.stream('statuses/filter', { track: app.locals.searchTerm }, (stream) => {
            stream.on('data', (tweet) => {
                //focusedReplies = await getAllReplies(app.locals.focusedTweet.tweetStrId, app.locals.focusedTweet.screenName) 
                sendMessage(tweet, socket);
            });

            stream.on('error', (error) => {
                console.error(error);
            });
            twitterStream = stream;
        });
    }

    app.post('/post-an-update', async (req, res) => {
        console.log('POST AN UPDATE TRIGGERED');
        console.log(req.body);
        let tweetStrId = req.body.tweetStrId;
        let screenName = req.body.screenName;
        let msg = req.body.msg;
        try {
            postAnUpdate(tweetStrId, screenName, msg, function(response) {
                res.status(200).send({response});
            });
        } catch (err) {
            res.status(501).send({msg: 'Something Went Wrong!', err});
        }
    });

    app.post('/get-all-replies', async (req, res) => {
        console.log('GET REPLIES TRIGGERED');
        console.log(req.body);
        let tweetStrId = req.body.tweetStrId;
        let screenName = req.body.screenName;
        try {
            getAllReplies(tweetStrId, screenName, function(response) {
                var feed = response;
                var comments = [];
                for (var index = 0; index < feed.statuses.length; index++) {
                    if (feed.statuses[index].in_reply_to_status_id_str === tweetStrId) {
                        comments.push(feed.statuses[index]);
                    }
                }
                console.log('All Replies: ' + comments);
                res.status(200).send({response: comments});
            });
        } catch (err) {
            res.status(501).send({msg: 'Something Went Wrong!', err});
        }
    });

    app.post('/set-search-term', (req, res) => {
        let term = req.body.term;
        console.log(term);
        app.locals.searchTerm = term;
        twitterStream.destroy();
        stream(gSocket);
    });

    app.post('/set-focused-tweet', (req, res) => {
        let tweetStrId = req.body.tweetStrId;
        let screenName = req.body.screenName;
        let term = {tweetStrId, screenName }
        app.locals.focusedTweet = term;
    });

    io.on("connection", socket => {
        gSocket = socket;
        stream(socket);
        socket.on("connection", () => console.log("Client connected"));
        socket.on("disconnect", () => console.log("Client disconnected"));
   });
};