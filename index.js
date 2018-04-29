/* load modules */
const config = require('config'),
  fs = require('fs'),
  ChannelDetail = require('./lib/channel-detail.js'),
  channelDetail = new ChannelDetail(config.channelDetail),
  VideoList = require('./lib/video-list.js'),
  videoList = new VideoList(config.videoList),
  VideoDetail = require('./lib/video-detail.js'),
  videoDetail = new VideoDetail(config.videoDetail),
  promisify = require('util').promisify,
  mkdirp = promisify(require('mkdirp'))

// add toFormat function on Date
require('date-utils')

/* load channel-list from csv */
let channelRaw = fs.readFileSync('./filtered.csv', 'utf8').split(/\r?\n/),
  channelList = []

for(let channel of channelRaw) {
  channelList.push(channel.substring(31))
  if(channelList.length >= 10) // option(have to erase on product)
    break
}

channelDetail.setWriter(async (result, channel, time) => {
  const fileName = `${config.rawDir}/channel-detail/${result.id}-${time}-channel-detail.txt`
  const file = fs.createWriteStream(fileName)

  file.write(JSON.stringify(result, null, '\t'))
  file.end()
})

videoList.setWriter(async (result) => {
  await mkdirp(result.dirName)
})

videoDetail.setWriter(async (result, dirName, videoId, time) => {
  const fileName = `${dirName}/${videoId}-${time}-video-detail.txt`
  const file = fs.createWriteStream(fileName)

  file.write(JSON.stringify(result, null, '\t'))
  file.end()
})

/* fetch jobs on main */
const main = async (channelList) => {
  /* run queue & save data */

  for(const channel of channelList){
    try {
      console.log('this is ' + channel)
      const time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')

      let videoCount = await channelDetail.collect(channel, time)

      if(videoCount === '0' || videoCount === 0) continue
      else console.log('Channel Detail ' + channel + ' done')

      let { dirName, videos } = await videoList.collect(channel, videoCount)
      console.log('Video List ' + channel + ' done')

      for(const videoId of videos){
        let r = videoDetail.collect(dirName, videoId)
      }
    } catch (error){
      console.log(`error on channel: ${channel}\nmaybe invalid channel?\nerror: ${error}`)
    }
  }
}

main(channelList)
