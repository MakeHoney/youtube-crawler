/* load modules */
const config = require('config'),
  fs = require('fs'),
  channelDetail = require('./lib/channel-detail.js'),
  videoList = require('./lib/video-list.js'),
  videoDetail = require('./lib/video-detail.js')

/* load channel-list from csv*/
var channel_raw = fs.readFileSync('./result2.csv', 'utf8').split(/\r?\n/)
var channel_list = []
for(var channel of channel_raw){
  channel_list.push(channel.substring(31))
  if(channel_list.length >= 10) // option(have to erase on product)
    break
}

/* fetch jobs on main */
const main = async (channel) => {
  try {
    let videoCount = await channelDetail(channel)
    if(videoCount === Error) throw new Error('invalid channel')
    else if(videoCount === '0' || videoCount === 0) return 0
    else console.log('Channel Detail ' + channel + ' done')
    let { dir_name, video_list } = await videoList(channel, videoCount)
    console.log('Video List ' + channel + ' done')
    for(const videoId of video_list){
      let r = videoDetail(dir_name, videoId)
    }
    //await videoDetail(dir_name, video_list)
  } catch (error){
    console.log(error)
  }
}

/* run queue & save data */
var tasks = {}
for(const channel of channel_list){
  console.log(channel)
  tasks["channelInfo" + channel] = main(channel)
}
