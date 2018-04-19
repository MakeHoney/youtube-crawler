const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils'),
  retry = require('async-retry')

module.exports = async (dirName, videoId, config = require('config')) => {
  const { retryOpt, requestOpt, saveData } = config.videoDetail,
    apiKey = config.apiKey,
    time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z'),
    fileName = `${dirName}/${videoId}-${time}-video-detail.txt`,
    retryRequest = async option => await retry(async () => {
      const res = await request(option)
      if (typeof res !== 'object' && res.length < 1) new Error('bad response')
      return res
    }, retryOpt)

  Object.assign(requestOpt.qs, {
    key: apiKey,
    id: videoId,
  })

  let body = await retryRequest(requestOpt)

  if (body !== undefined){
    if (body.items !== undefined){
      const file = await fs.createWriteStream(fileName),
        item = body.items[0]

      await saveData(
        file,
        videoId,
        item.snippet.title,
        'http://youtube.com/watch?v=' + videoId,
        item.snippet.thumbnails.high.url,
        item.snippet.categoryId,
        item.statistics.viewCount,
        item.statistics.likeCount,
        item.statistics.dislikeCount,
        item.statistics.commentCount,
        item.snippet.publishedAt,
        time
      )
      return 'done'
    }
    return Error('invalid video error')
  }
  return Error('video request error')
}
