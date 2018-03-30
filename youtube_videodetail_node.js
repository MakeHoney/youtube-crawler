// Getting video_detail_info by each videos on YouTube Channel using Youtube Data API v3

var async = require('async');
var request = require('request-promise');
var fs = require('fs');
var date = require('date-utils');

var base_url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics';

// Will Modify file.write codes to JSON style maker
module.exports = function(api_key) {
  return {
    videoDetail: function(dir_name, videoId) {
      var url = base_url + '&key=' + api_key + '&id=' + videoId;
      var newDate = new Date();
      var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z');
      var file_name = dir_name + videoId + '-' + time + '_videoDetail' + '.txt';
      var file = fs.createWriteStream(file_name);
      async function main(url, file) {
        async function search_video(url) {
          var body = await request({
              url: url,
              json: true
            })
            .then(function(response) {
              if (response)
                return response;
            })
            .catch(function(err) {
              console.log('VideoDetail Error');
              return undefined;
            });
          if (body !== undefined) {
            if (body.items !== undefined) {
              await file.write('{\nvideo_id: ' + videoId + ',\n');
              await file.write('video_name: ' + body.items[0].snippet.title + ',\n');
              await file.write('video_url: ' + 'http://youtube.com/watch?v=' + videoId + ',\n'); // get url
              await file.write('video_thumbnails: ' + body.items[0].snippet.thumbnails.default.url + ',\n'); // can choose default(88), medium(240), high(800)
              await file.write('video_category: ' + body.items[0].snippet.categoryId + ',\n');
              await file.write('video_viewCount: ' + body.items[0].statistics.viewCount + ',\n');
              await file.write('video_likeCount: ' + body.items[0].statistics.likeCount + ',\n');
              await file.write('video_dislikeCount: ' + body.items[0].statistics.dislikeCount + ',\n');
              await file.write('video_commentCount: ' + body.items[0].statistics.commentCount + ',\n');
              await file.write('video_publishedAt: ' + body.items[0].snippet.publishedAt + ',\n');
              await file.write('video_crawledAt: ' + time + '\n}');
            }
            return 'done';
          }
          else{
            return 'none';
          }
        }
        var r = await search_video(url);
      }
      main(url, file);
      return 'done';
    }
  }
}
