// Getting video_ids by each channel on YouTube using Youtube Data API v3
// This gets maximum over 500 videos' video_id by nextPageToken, publishedAt
// This gets video_id by Youtube Data API v3's Search API

// basic code

var async = require('async');
var asyncLoop = require('node-async-loop');
var request = require('request');
var fs = require('fs');
var date = require('date-utils');

var channel_list = ['UCFM_07Mxv6CglREk8qdkPaw', 'UCUXYT0CqvBx1ZysmxSW7EDQ', 'UCu9BCtGIEr73LXZsKmoujKw'];
var api_key = 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo';
var base_url = 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&order=date&maxResults=50';

function doRequest(url){
  return new Promise(function(resolve, reject){
    request({ url: url, json: true }, function(error, response, body) {
      if (!error && response.statusCode === 200) resolve(body);
      else reject(error);
    });
  });
}

for(const channel of channel_list){
  var init_url = base_url + '&key=' + api_key + '&channelId=' + channel;
  var url = init_url;
  var mid_url = init_url;
  var newDate = new Date();
  var time = newDate.toFormat('YYYYMMDD_HH24:MI:SS');
  var file_name = channel + '-' + time + '_videolist' + '.txt';
  var file = fs.createWriteStream(file_name);
  var nextPageToken;
  var prevPageToken;
  var publishedAt;
  var pageList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  async function search_for_total(init_url, file, url, mid_url, nextPageToken, prevPageToken, publishedAt, pageList){
    let in_body = await doRequest(init_url);
    var loop_count = Math.floor(in_body.pageInfo.totalResults / 500 + 1);

    async function search_for_500(){
      for(const page of pageList){
        let body = await doRequest(url);
        if(body != undefined){
          for (const item of body.items) {
            if(item.id.videoId != undefined)
              await file.write(item.id.videoId + '\n');
            nextPageToken = await body.nextPageToken;
            publishedAt = await item.snippet.publishedAt;
          }
          if(nextPageToken != 'endPage')
            url = await mid_url + '&pageToken=' + nextPageToken;
          if(nextPageToken == prevPageToken)
            return 'done';
          prevPageToken = nextPageToken;
        }
      }
      mid_url = await init_url + '&publishedBefore=' + publishedAt;
      url = mid_url;
      nextPageToken = 'endPage';
    }

    var i = 0;
    while(true){
      var r = await search_for_500();
      i = i + 1;
      if(i == loop_count)
        break;
    }
  }
  search_for_total(init_url, file, url, mid_url, nextPageToken, prevPageToken, publishedAt, pageList);
}
