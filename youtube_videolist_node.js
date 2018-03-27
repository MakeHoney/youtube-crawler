// Getting video_ids by each channel on YouTube using Youtube Data API v3
// This gets maximum over 500 videos' video_id by nextPageToken, publishedAt
// This gets video_id by Youtube Data API v3's Search API

// basic code

var async = require('async');
var request = require('request-promise');
var fs = require('fs');
var date = require('date-utils');
var mkdirp = require('mkdirp');
var video_detail_node = require('./youtube_videodetail_node.js');

var base_url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&order=date&maxResults=50';

module.exports = function(api_key, channel_list) {
  return {
    videoList: function() {
      for (const channel of channel_list) {
        var init_url = base_url + '&key=' + api_key + '&channelId=' + channel;
        var url = init_url;
        var mid_url = init_url;
        var newDate = new Date();
        var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z');
        var file_name = channel + '-' + time + '_videolist' + '.txt';
        //var file = fs.createWriteStream(file_name);
        var nextPageToken;
        var prevPageToken;
        var publishedAt;
        var pageList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        async function search_for_total(file_name, init_url, url, mid_url, nextPageToken, prevPageToken, publishedAt, pageList) {
          var in_body = await request({url: init_url, json: true})
            .then(function(response) {
              if(response)
                return response;
            })
            .catch(function(err) {
              console.log('VideoList Error');
              return console.log(err);
            });
          var loop_count = Math.floor(in_body.pageInfo.totalResults / 500 + 1);
          console.log(in_body.pageInfo.totalResults)
          if (in_body.pageInfo.totalResults === 0) {
            return console.log('Video Not found: ' + url);
          }
          var dir_name = './' + channel + '_' + time + '_videoDetail/';
          await mkdirp(dir_name, function(err) {
            if (err != null) {
              console.log('error occured');
              console.log(err);
            }
          });
          var file = await fs.createWriteStream(file_name);
          async function search_for_500() {
            for (const page of pageList) {
              var body = await request({url: url, json: true})
                .then(function(response) {
                  if(response)
                    return response;
                })
                .catch(function(err) {
                  return 0;
                });
              if (body !== undefined) {
                for (const item of body.items) {
                  if (item.id.videoId != undefined) {
                    await file.write(item.id.videoId + '\n');
                    let videoDetail = await video_detail_node(api_key);
                    await console.log('videoId: ' + item.id.videoId + ' ' + videoDetail.videoDetail(dir_name, item.id.videoId));
                  }
                  nextPageToken = await body.nextPageToken;
                  publishedAt = await item.snippet.publishedAt;
                }
                if (nextPageToken != 'endPage')
                  url = await mid_url + '&pageToken=' + nextPageToken;
                if (nextPageToken == prevPageToken)
                  return 'done';
                prevPageToken = nextPageToken;
              }
              else {
                if (page < 9)
                  return 'done';
                else
                  return console.log('Error on VideoList');
              }
            }
            mid_url = await init_url + '&publishedBefore=' + publishedAt;
            url = mid_url;
            nextPageToken = 'endPage';
          }

          var i = 0;
          while (true) {
            var r = await search_for_500();
            i = i + 1;
            if (i == loop_count)
              break;
          }
        }
        search_for_total(file_name, init_url, url, mid_url, nextPageToken, prevPageToken, publishedAt, pageList);
      }
      return 'done';
    }
  }
}
