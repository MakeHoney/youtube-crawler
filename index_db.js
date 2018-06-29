/* load modules */
const config = require('config'),
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

/* database module */
var mysql = require('mysql'),
  dbConnection = mysql.createConnection({
  host: "13.209.8.64",
  user: "teamRedFan",
  password: "1234",
  database: "redFan"
});

/* load channelID from input */
let channel = 'UCxx7UvIhPkEQxaplaWS2hLg'
var sql;

// development env wirter setting
if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

  channelDetail.setWriter(async (result, channel, time) => {

    sql = "INSERT INTO channels VALUES('" +
          result.channelId + "','" +
          result.channelUrl + "','" +
          result.channelThumbs + "'," +
          result.channelViewCount + "," +
          result.channelSubscriberCount + "," +
          result.channelVideoCount + ",'" +
          result.channelPublishedAt + "','" +
          result.channelCrawledAt +
    "')";

    dbConnection.query(sql, function(err, row) {
      if(err) throw err;
        // console.log("successfully written");
    });
  })

  videoList.setWriter(async (result, channel) => {
    await mkdirp(result.dirName)
    console.log('Video List ' + channel + ' done')
  })

  videoDetail.setWriter(async (result, dirName, videoId, time) => {
    var videoTitle = result.videoTitle.replace(/['"]+/g, '');
    sql = "INSERT INTO videos VALUES('" +
          result.videoId + "','" +
          videoTitle + "','" +
          result.videoUrl + "','" +
          result.videoThumbs + "'," +
          result.videoCategoryId + "," +
          result.videoViewCount + "," +
          result.videoLikeCount + "," +
          result.videoDislikeCount + "," +
          result.videoCommentCount + ",'" +
          result.videoPublishedAt + "','" +
          result.videoCrawledAt + "','" +
          result.videoChannelId +
    "')";

    dbConnection.query(sql, function(err, row) {
      if(err) throw err;
        // console.log("successfully written");
    });
  })

  commentDetail.setWriter(async (result, dirName, videoId, time) => {
    var commentText;
    result.forEach(function(element, index, array) {
      commentText = element.commentText.replace(/['"]+/g, '');

      sql = "INSERT INTO comments VALUES('" +
            element.commentId + "','" +
            element.commentAuthorName + "','" +
            element.commentAuthorThumbs + "','" +
            commentText + "'," +
            // element.commentText + "'," +
            element.commentLikeCount + ",'" +
            element.videoId + "','" +
            element.commentPublishedAt + "','" +
            element.commentCrawledAt +
      "')";

      dbConnection.query(sql, function(err, row) {
        if(err) throw err;
        // console.log("successfully written");
      });
    })

  })
}

/* fetch jobs on main */
const main = async (channel) => {
  /* run queue & save data */
  try {
    const time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')
    let videoCount = 1
    // let videoCount = await channelDetail.collect(channel, time)
    pqueue.add(() => channelDetail.collect(channel, time)).then(function(videoCount){
      if(videoCount === '0' || videoCount === 0) throw new Error('Empty Channel')
        pqueue.add(() => videoList.collect(channel, videoCount)).then(function({ dirName, videos, channelId }){
          console.log(channel + ' videoList done')
          for(const videoId of videos){
            pqueue.add(() => videoDetail.collect(dirName, videoId, channelId)).then(function(result){
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

/* when we export index.js */
module.exports = main

/* When we don't export index.js */
// main(channel)
