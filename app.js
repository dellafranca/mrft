var app = require('express').createServer(),
    twitter = require('ntwitter'),
    io = require('socket.io').listen(app),
    love = 0,
    hate = 0,
    total = 0;

app.listen(80);

var twit = new twitter({
  consumer_key: '7toAqfdHLAoLEeRu7XJGJA',
  consumer_secret: '95TtO4jpZel3aqhHphe0tga2IIOI9apcyr8Efwc0',
  access_token_key: '2233757042-sUE6bcqJFiita0HhCD8Rod7gIFFVRWqBZZr5cMo',
  access_token_secret: 'cOhxaAKW4CyGpAohCrZQSueCvFNKrhPsoVmRGAyMe4Rom'
});

twit.stream('statuses/filter', { track: ['love', 'hate'] }, function(stream) {
  stream.on('data', function (data) {
    if (data.text) { 
      var text = data.text.toLowerCase();
      if (text.indexOf('love') != -1) {
        love++
        total++
        if ((love % 82) == 0){
          io.sockets.volatile.emit('lover', { 
            user: data.user.screen_name, 
            text: data.text,
            avatar: data.user.profile_image_url_https
          });
        }
      }
      if (text.indexOf('hate') != -1) {
        hate++
        total++
        if ((hate % 18) == 0){
          io.sockets.volatile.emit('hater', { 
            user: data.user.screen_name, 
            text: data.text,
            avatar: data.user.profile_image_url_https
          });
        }
      }
      io.sockets.volatile.emit('percentages', { 
        love: (love/total)*100,
        hate: (hate/total)*100
      });
    }
  });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

