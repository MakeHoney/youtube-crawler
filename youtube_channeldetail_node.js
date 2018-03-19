// Getting channel_detail_info by each channel on YouTube using Youtube Data API v3

var async = require('async');
var request = require('request');
var fs = require('fs');
var date = require('date-utils');

var channel_list = ['UCFM_07Mxv6CglREk8qdkPaw', 'UCUXYT0CqvBx1ZysmxSW7EDQ', 'UCu9BCtGIEr73LXZsKmoujKw'];
var api_key = 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo';
var base_url = 'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics';

function doRequest(url) {
  return new Promise(function(resolve, reject) {
    request({
      url: url,
      json: true
    }, function(error, response, body) {
      if (!error && response.statusCode === 200) resolve(body);
      else reject(error);
    });
  });
}

// Will Modify file.write codes to JSON style maker
for (const channel of channel_list) {
  var url = base_url + '&key=' + api_key + '&id=' + channel;
  var newDate = new Date();
  var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z');
  var file_name = channel + '-' + time + '_channeldetail' + '.txt';
  var file = fs.createWriteStream(file_name);
  async function main(url, file) {
    async function search_channel(url) {
      let body = await doRequest(url);
      if (body != undefined) {
        await file.write('{\nchannel_id: ' + channel + ',\n');
        await file.write('channel_name: ' + body.items[0].snippet.title + ',\n');
        await file.write('channel_url: ' + url + ',\n'); // get url
        await file.write('channel_thumbnails: ' + body.items[0].snippet.thumbnails.default.url + ',\n'); // can choose default(88), medium(240), high(800)
        await file.write('channel_viewCount: ' + body.items[0].statistics.viewCount + ',\n');
        await file.write('channel_subscriberCount: ' + body.items[0].statistics.subscriberCount + ',\n');
        await file.write('channel_videoCount: ' + body.items[0].statistics.videoCount + ',\n');
        await file.write('channel_publishedAt: ' + body.items[0].snippet.publishedAt + ',\n');
        await file.write('channel_crawledAt: ' + time + '\n}');
      }
      return 'done';
    }
    var r = await search_channel(url);
  }
  main(url, file);
}
