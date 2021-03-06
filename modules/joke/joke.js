var reddit = require('./../common/reddit.js'),
    request = require.safe('request'),
    results = [];

exports.match = function(text, commandPrefix) {
    return text.startsWith(commandPrefix + 'joke');
};

exports.help = function(commandPrefix) {
    return [[commandPrefix + 'joke','A mixed bag of fun.']];
};

exports.joke = function(callback, waitCallback) {
    // If we have no stored joke, get some
    if (typeof results === 'undefined' || results === null || results.length === 0) {
		waitCallback();
        reddit.reddit('jokes', 200, function (err, data) {
            if (!err) {
                results = data;
                exports.fuckNode(callback);
            }
            else {
                callback(data);
            }
        });
    }
    else {
        exports.fuckNode(callback);
    }
};

exports.fuckNode = function(callback) {
    // Get some random joke

    var index = Math.floor(Math.random() * results.length),
        title = results[index].data.title,
        text = results[index].data.selftext;

    // Delete the joke, so we don't get it again
    results.splice(index, 1);

    callback(title + '\n' + text);
};

exports.run = function(api, event) {
    exports.joke(function(result) {
        api.sendMessage(result, event.thread_id);
    },
	function() {
		api.sendTyping(event.thread_id);
	});
};
