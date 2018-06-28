const Collector = require('./collector'),
  deepCopy = require('./deep-copy')

module.exports = class ChannelDetail extends Collector {
  reformatter(body, time) {
    const item = body.items[0]

    return {
      channelId: item.id,
      channelName: item.snippet.title,
      channelUrl: `http://www.youtube.com/channel/${item.id}`,
      channelThumbs: item.snippet.thumbnails.high.url,
      channelViewCount: item.statistics.viewCount,
      channelSubscriberCount: item.statistics.subscriberCount,
      channelVideoCount: item.statistics.videoCount,
      channelPublishedAt: item.snippet.publishedAt,
      channelCrawledAt: time,
    }
  }

  async collect(channel, time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')) {
    let channelDetailOption = deepCopy(this.config.requestOpt)
    Object.assign(channelDetailOption.qs, {
      key: this.config.apiKey,
      id: channel,
    })

    // request & error check
    let body = await this.retryRequest(channelDetailOption)
    if (body.items[0].statistics.videoCount === '0') return 0

    // reformat response & call write function
    const result = this.reformatter(body, time)
    await this.writer(result, channel, time)

    return result.videoCount
  }
}
