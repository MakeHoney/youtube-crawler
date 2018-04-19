const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils'),
  retry = require('async-retry')

module.exports = async (channel, config = require('config')) => {
  const { retryOpt, requestOpt, saveData } = config.channelDetail,
    apiKey = config.apiKey,
    time = (new Date()).toFormat('YYYY-MM-DDTHH24:MI:SS.000Z'),
    fileName = `${config.rawDir}/channel-detail/${channel}-${time}-channel-detail.txt`,
    retryRequest = async option => await retry(async () => {
      const res = await request(option)
      if (typeof res !== 'object' && res.length < 1) new Error('bad response')
      return res
    }, retryOpt)

  Object.assign(requestOpt.qs, {
    key: apiKey,
    id: channel,
  })

  let body = await retryRequest(requestOpt),
    item = body.items[0]

  if (item.statistics.videoCount !== '0'){
    const file = await fs.createWriteStream(fileName)

    await saveData(
      file,
      channel,
      item.snippet.title,
      'http://www.youtube.com/channel/' + channel,
      item.snippet.thumbnails.high.url,
      item.statistics.viewCount,
      item.statistics.subscriberCount,
      item.statistics.videoCount,
      item.snippet.publishedAt,
      time
    )
    return item.statistics.videoCount
  }

  return 0
}
