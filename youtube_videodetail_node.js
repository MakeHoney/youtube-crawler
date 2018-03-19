// Getting video_detail_info by each videos on YouTube Channel using Youtube Data API v3

var async = require('async');
var request = require('request');
var fs = require('fs');
var date = require('date-utils');
var video_list = ['iWa22HghV3s', 'Mx3-HeATdSc', 'k5DUhoa8P08' ,'ob7q9Rd5O8M', 'YhEZtBKYLs0'];
var api_key = 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo';
var base_url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics';

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
for (const video of video_list) {
  var url = base_url + '&key=' + api_key + '&id=' + video;
  var newDate = new Date();
  var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z');
  var file_name = video + '-' + time + '_videoDetail' + '.txt';
  var file = fs.createWriteStream(file_name);
  async function main(url, file) {
    async function search_video(url) {
      let body = await doRequest(url);
      if (body != undefined) {
        await file.write('{\nvideo_id: ' + video + ',\n');
        await file.write('video_name: ' + body.items[0].snippet.title + ',\n');
        await file.write('video_url: ' + 'http://youtube.com/watch?v=' + video + ',\n'); // get url
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
    var r = await search_video(url);
  }
  main(url, file);
}
