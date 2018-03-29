var async = require('async');
var fs = require('fs');

var channel_detail_node = require('./youtube_channeldetail_node.js');
var video_list_node = require('./youtube_videolist_node.js');
var r_cl = [];
var channel_list = [];
r_cl = fs.readFileSync('./result2.csv', 'utf8').split(/\r?\n/);
var count = 0;
for(var channel of r_cl){
  channel_list.push(channel.substring(31));
  count += 1;
  if(count >= 25)
    break;
}
var api_key = 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo';
//var api_key = 'AIzaSyD4OiN3CC8FtDujdkyDsOCBQJdrOTyoeDE';

for(const channel of channel_list){
  var my_channel_detail = channel_detail_node(api_key, channel);
  var my_video_list = video_list_node(api_key, channel);
  var r = my_channel_detail.channelDetail();
  console.log('channel_detail: ' + r + '\n');
  if(r === 'none')
    console.log('this is none');
  else
    console.log('video_list: ' + my_video_list.videoList() + '\n');
}
