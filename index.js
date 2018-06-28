/* load modules */
const config = require('config'),
  fs = require('fs'),
  ChannelDetail = require('./lib/channel-detail.js'),
  channelDetail = new ChannelDetail(config.channelDetail),
  VideoList = require('./lib/video-list.js'),
  videoList = new VideoList(config.videoList),
  VideoDetail = require('./lib/video-detail.js'),
  videoDetail = new VideoDetail(config.videoDetail),
  CommentDetail = require('./lib/comment-detail.js'),
  commentDetail = new CommentDetail(config.commentDetail),
  promisify = require('util').promisify,
  cluster = require('cluster'),
  Pqueue = require('p-queue'),
  pqueue = new Pqueue({ concurrency: config.m }),
  numCPUs = require('os').cpus().length,
  mkdirp = promisify(require('mkdirp'))

// add toFormat function on Date
require('date-utils')

/* load channelID from input */
let channel = 'UCxx7UvIhPkEQxaplaWS2hLg'

// development env wirter setting
if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

  channelDetail.setWriter(async (result, channel, time) => {
    const fileName = `${config.rawDir}/channel-detail/${channel}-${time}-channel-detail.txt`
    const file = fs.createWriteStream(fileName)

    file.write(JSON.stringify(result, null, '\t'))
    file.end()
    console.log('Channel Detail ' + channel + ' done')
  })

  videoList.setWriter(async (result, channel) => {
    await mkdirp(result.dirName)
    console.log('Video List ' + channel + ' done')
  })

  videoDetail.setWriter(async (result, dirName, videoId, time) => {
    const fileName = `${dirName}/${videoId}-${time}-video-detail.txt`
    const file = fs.createWriteStream(fileName)

    file.write(JSON.stringify(result, null, '\t'))
    file.end()
  })

  commentDetail.setWriter(async (result, dirName, videoId, time) => {
    const fileName = `${dirName}/${videoId}-${time}-comment-detail.txt`
    const file = fs.createWriteStream(fileName)

    file.write(JSON.stringify(result, null, '\t'))
    file.end()
  })
}

/* fetch jobs on main */
const main = async (channel) => {
  /* run queue & save data */
  try {
    console.log('this is ' + channel)
    const time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')
    let videoCount = await channelDetail.collect(channel, time)
    pqueue.add(() => channelDetail.collect(channel, time)).then(function(videoCount){
      if(videoCount === '0' || videoCount === 0) throw new Error('Empty Channel')
        pqueue.add(() => videoList.collect(channel, videoCount)).then(function({ dirName, videos }){
          console.log(channel + ' videoList done')
          console.log(videos)
          for(const videoId of videos){
            pqueue.add(() => videoDetail.collect(dirName, videoId)).then(function(result){
              console.log(videoId + ' videoDetail done')
              pqueue.add(() => commentDetail.collect(dirName, videoId).then(console.log.bind(null, videoId + ' commentDetail done')))
            })
          }
        })
    })
  } catch (error){
      console.log(`error on channel: ${channel}\nmaybe invalid channel?\nerror: ${error}`)
  }
}

main(channel)
