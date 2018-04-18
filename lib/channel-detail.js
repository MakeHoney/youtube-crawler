const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils'),
  retry = require('async-retry')

module.exports = async (channel, config = require('config')) => {
  const { apiKey, retryOpt, requestOpt, saveData } = config.channelDetail,
    time = (new Date()).toFormat('YYYY-MM-DDTHH24:MI:SS.000Z'),
    fileName = `./crawled/channel-detail/${channel}-${time}-channel-detail.txt`,
    retryRequest = async option => await retry(async () => {
      const res = await request(option)
      console.log(res)
      if (typeof res !== 'object' && res.length < 1) new Error('bad response')
      return res
    }, retryOpt)

  Object.assign(requestOpt.qs, {
    key: apiKey,
    id: channel,
  })

  let body = await retryRequest(requestOpt)

  if (body.items[0].statistics.videoCount !== '0'){
    const file = await fs.createWriteStream(fileName)

    await saveData(
      file,
      channel,
      body.items[0].snippet.title,
      'http://www.youtube.com/channel/' + channel,
      body.items[0].snippet.thumbnails.high.url,
      body.items[0].statistics.viewCount,
      body.items[0].statistics.subscriberCount,
      body.items[0].statistics.videoCount,
      body.items[0].snippet.publishedAt,
      time
    )
    return body.items[0].statistics.videoCount
  }

  return 0
}
