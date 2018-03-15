// Getting video_ids by each channel on YouTube using Youtube Data API v3
// This gets maximum 25000 videos' video_id by nextPageToken
// This gets video_id by Youtube Data API v3's Search API

// basic code

var asyncLoop = require('node-async-loop');
var request = require('request');
var fs = require('fs');
var date = require('date-utils');

var channel_list = ['UCUXYT0CqvBx1ZysmxSW7EDQ', 'UCFM_07Mxv6CglREk8qdkPaw'];
var api_key = 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo';
var base_url = 'https://www.googleapis.com/youtube/v3/search?part=id&order=date&maxResults=50';
var channel_index = [];

for (var i = 0; i < channel_list.length; i++) {
  channel_index.push(i);
}

asyncLoop(channel_index, function(i, next) {
  var init_url = base_url + '&key=' + api_key + '&channelId=' + channel_list[i];
  var newDate = new Date();
  var time = newDate.toFormat('YYYYMMDD_HH24:MI:SS');
  var file_name = time + '_video_list_' + i + '.txt';
  var file = fs.createWriteStream(file_name);
  var url = init_url;
  var nextPageToken;
  var prevPageToken;
  var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  asyncLoop(array, function(item, next) {
    request({ url: url, json: true }, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        for (var j = 0; j < body.items.length; j++) {
          if(body.items[j].id.videoId != undefined)
            file.write(body.items[j].id.videoId + '\n');
          nextPageToken = body.nextPageToken;
        }
      }
      url = init_url + '&pageToken=' + nextPageToken;
      prevPageToken = nextPageToken;
      next();
    });
  });

  next();
});
