var async = require('async');
var fs = require('fs');

var channelDetail = require('./youtube_channeldetail_node.js');
var videoList = require('./youtube_videolist_node.js');
var channel_temp = [];
var channel_list = [];
//var api_key = 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo';
var api_key = 'AIzaSyD4OiN3CC8FtDujdkyDsOCBQJdrOTyoeDE';

// LOAD channel_list from csv or etc
channel_temp = fs.readFileSync('./result2.csv', 'utf8').split(/\r?\n/);
var count = 0;
for(var channel of channel_temp){
  channel_list.push(channel.substring(31));
  count += 1;
  if(count >= 10)
    break;
}

async function main(api_key, channel){
  channelDetail.channelDetailAsync(api_key, channel, function(error, result){
    if(error)
      console.log(error);
    else{
      console.log(result);
      var videoList = require('./youtube_videolist_node.js');
      videoList.videoListAsync(api_key, channel, result, function(error, result){
        if(error)
          console.log(error);
        else
          console.log(result);
      });
    }
  });
}

var tasks = {};
for(var channel of channel_list){
  console.log(channel);
  tasks["channelInfo" + channel] = main(api_key, channel);
}
