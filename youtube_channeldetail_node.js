// Getting channel_detail_info by each channel on YouTube using Youtube Data API v3

var async = require('async');
var request = require('request-promise');
var fs = require('fs');
var date = require('date-utils');

var base_url = 'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics';

// Will Modify file.write codes to JSON style maker
module.exports = function(api_key, channel) {
  return {
    channelDetail: function() {
      var url = base_url + '&key=' + api_key + '&id=' + channel;
      var newDate = new Date();
      var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z');
      var file_name = channel + '-' + time + '_channeldetail' + '.txt';
      async function main(url, file_name) {
        async function search_channel(url) {
          var body = await request({
              url: url,
              json: true
            })
            .then(function(response) {
              if (response)
                return response;
            })
            .catch(function(err) {
              console.log('ChannelDetail Error');
              console.log(err);
              return undefined;
            });
          if (body !== undefined) {
            if (body.items[0].statistics.videoCount !== "0" && body.items[0].statistics.videoCount !== 0) {
              var file = await fs.createWriteStream(file_name);
              await file.write('{\nchannel_id: ' + channel + ',\n');
              await file.write('channel_name: ' + body.items[0].snippet.title + ',\n');
              await file.write('channel_url: ' + 'http://www.youtube.com/channel/' + channel + ',\n'); // get url
              await file.write('channel_thumbnails: ' + body.items[0].snippet.thumbnails.default.url + ',\n'); // can choose default(88), medium(240), high(800)
              await file.write('channel_viewCount: ' + body.items[0].statistics.viewCount + ',\n');
              await file.write('channel_subscriberCount: ' + body.items[0].statistics.subscriberCount + ',\n');
              await file.write('channel_videoCount: ' + body.items[0].statistics.videoCount + ',\n');
              await file.write('channel_publishedAt: ' + body.items[0].snippet.publishedAt + ',\n');
              await file.write('channel_crawledAt: ' + time + '\n}');
            }
            else{
              return 'none';
            }
          }
          return 'done';
        }
        var r = await search_channel(url);
        if(r === 'none')
          return r;
      }
      var r = main(url, file_name);
      if(r === 'none')
        return 'none';
      return 'done';
    }
  }
}
