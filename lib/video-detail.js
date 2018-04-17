// Getting video_detail_info by each videos on YouTube Channel using Youtube Data API v3

const async = require('async'),
  request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils')

module.exports = async (dir_name, videoId, config = require('config')) => {
  const { api_key, base_url, retryOpt, saveData } = config.videoDetail
  const url = base_url + '&key=' + api_key + '&id=' + videoId
  var newDate = new Date()
  var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z')
  const file_name = dir_name + videoId + '-' + time + '_videoDetail' + '.txt'

  const body = await request({
    url: url,
    json: true,
  })

  if (body !== undefined){
    if (body.items !== undefined){
      var file = await fs.createWriteStream(file_name)
      await saveData(
        file,
        videoId,
        body.items[0].snippet.title,
        'http://youtube.com/watch?v=' + videoId,
        body.items[0].snippet.thumbnails.high.url,
        body.items[0].snippet.categoryId,
        body.items[0].statistics.viewCount,
        body.items[0].statistics.likeCount,
        body.items[0].statistics.dislikeCount,
        body.items[0].statistics.commentCount,
        body.items[0].snippet.publishedAt,
        time
      )
      return videoId + ' done'
    }
    return Error('invalid video error')
  }
  return Error('video request error')
}
