var express = require('express');
var app = express(), server = require('http').createServer(app), io = require(
		'socket.io').listen(server), twitter = require('ntwitter'), love = 0, hate = 0, total = 0;

server.listen(80);

var twit = new twitter({
	consumer_key : 'WV2epEiUnxCfI6oFCeDJg',
	consumer_secret : '0G0vnXsnHrVp4CHBeMMltHgCEGBFu8Fg3YU87XnWs',
	access_token_key : '2233757042-Cw2Wn1cSr1bGIhZEN40PPSkp6yYQkEzO7JaoOgT',
	access_token_secret : 'IToOsrmDBWOO1y9wNzmDix0kW6Sbps5M1QFay82BraA4b'
});

twit.stream('statuses/filter', {
	track : [ 'love', 'hate' ]
}, function(stream) {
	stream.on('data', function(data) {
		if (data.text) {
			var text = data.text.toLowerCase();
			if (text.indexOf('love') !== -1) {
				love = love + 1;
				total = total + 1;
				if ((love % 82) === 0) {
					io.sockets.volatile.emit('lover', {
						user : data.user.screen_name,
						text : data.text,
						avatar : data.user.profile_image_url_https
					});
				}
			}
			if (text.indexOf('hate') !== -1) {
				hate = hate + 1;
				total = total + 1;
				if ((hate % 18) === 0) {
					io.sockets.volatile.emit('hater', {
						user : data.user.screen_name,
						text : data.text,
						avatar : data.user.profile_image_url_https
					});
				}
			}
			io.sockets.volatile.emit('percentages', {
				love : (love / total) * 100,
				hate : (hate / total) * 100
			});
		}
	});
});

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});
