const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils'),
  retry = require('async-retry'),
  deepCopy = require('./deep-copy')

module.exports = async (channel, config = require('config')) => {
  const { retryOpt, requestOpt, saveMeta, saveData } = config.channelDetail,
    apiKey = config.apiKey,
    time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z'),
    fileName = `${config.rawDir}/channel-detail/${channel}-${time}-channel-detail.txt`,
    retryRequest = async option => await retry(async () => {
      const res = await request(option)
      if (typeof res !== 'object' && res.length < 1) new Error('bad response')
      return res
    }, retryOpt)

  // copy config request option & add qs params
  let channelDetailOption = deepCopy(requestOpt)
  Object.assign(channelDetailOption.qs, {
    key: apiKey,
    id: channel,
  })

  let body = await retryRequest(channelDetailOption),
    item = body.items[0]

  if (item.statistics.videoCount !== '0'){
    const file = await fs.createWriteStream(fileName)

    await saveMeta(
      channel, // channelId
      item.snippet.title, // channelTitle
      item.snippet.description, // channelDesc
      'http://www.youtube.com/channel/' + channel, // channelUrl
      [item.snippet.thumbnails.high.url], // channelThumbnails
      //item.statistics.viewCount, // viewCount
      //item.statistics.subscriberCount, // subscriberCount
      //item.statistics.videoCount, // videoCount
      item.snippet.publishedAt, // publishedAt
      //time // channelCrawledAt
    )
    return item.statistics.videoCount
  }

  return 0
}
