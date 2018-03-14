// Getting video_ids by each channel on YouTube using Youtube Data API v3
// This gets maximum 25000 videos' video_id by nextPageToken
// This gets video_id by Youtube Data API v3's Search API

var asyncLoop = require('node-async-loop');
var request = require('request');
var channel_list = ['UCUXYT0CqvBx1ZysmxSW7EDQ', 'UCFM_07Mxv6CglREk8qdkPaw'];
var api_key = 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo';
var base_url = 'https://www.googleapis.com/youtube/v3/search?part=id&order=date&maxResults=50';
var channel_info = new Array();
channel_info[0] = [];
channel_info[1] = [];

for(var i = 0; i < channel_list.length; i ++){
  var init_url = base_url + '&key=' + api_key + '&channelId=' + channel_list[i];
  var url = init_url;
  var nextPageToken;
  var prevPageToken;

  var array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  asyncLoop(array, function(item, next){

    console.log(url);
    request({ url: url, json: true }, function(error, response, body){

      if(!error && response.statusCode === 200){
        for(var i = 0; i < body.items.length; i ++){
          console.log(body.items[i].id.videoId); // store videoid into channel_info[i]
          nextPageToken = body.nextPageToken;
        }
      }

      url = init_url + '&pageToken=' + nextPageToken;
      if(nextPageToken == prevPageToken) // then, break in anyway,
        return;
      prevPageToken = nextPageToken;

      next();
    }, function(err){
      if(err){
        console.error('error');
        return;
      }
    });
  });
}
