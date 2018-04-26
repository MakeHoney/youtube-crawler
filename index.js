/* load modules */
const config = require('config'),
  fs = require('fs'),
  channelDetail = require('./lib/channel-detail.js'),
  videoList = require('./lib/video-list.js'),
  videoDetail = require('./lib/video-detail.js')

/* load channel-list from csv */
var channelRaw = fs.readFileSync('./filtered.csv', 'utf8').split(/\r?\n/)
var channelList = []
for(var channel of channelRaw){
  channelList.push(channel.substring(31))
  // if(channelList.length >= 10) // option(have to erase on product)
  //    break
}

/* fetch jobs on main */
const main = async (channelList) => {
  /* run queue & save data */
  for(const channel of channelList){
    try {
      console.log('this is ' + channel)
      let videoCount = await channelDetail(channel)
      if(videoCount === '0' || videoCount === 0) continue
      else console.log('Channel Detail ' + channel + ' done')

      // let { dirName, videos } = await videoList(channel, videoCount)
      // console.log('Video List ' + channel + ' done')
      //
      // for(const videoId of videos){
      //   let r = videoDetail(dirName, videoId)
      // }
    } catch (error){
      console.log(`error on channel: ${channel}\nmaybe invalid channel?\nerror: ${error.message}`)
    }
  }
}

main(channelList)
