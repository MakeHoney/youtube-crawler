const Collector = require('./collector'),
  deepCopy = require('./deep-copy')

module.exports = class ChannelList extends Collector {
  // search for maximum api by api
  async search10(listOption, videos) {
    let publishedAt

    let body = await this.retryRequest(listOption)

    // push video id on videos array
    for (let item of body.items){
      if (item !== undefined && item.id.videoId !== undefined){
        videos.push(item.id.videoId)
        console.log('video ' + item.id.videoId + ' fetched')
      }
    }

  }

  async collect(channel, videoCount, time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')) {

    const dirName = `${this.config.rawDir}/video-detail/${channel}-${time}-video-detail/`

    if (videoCount === 0 || videoCount === '0') throw new Error('empty channel error')

    // copy config request option & add qs params
    let listOption = deepCopy(this.config.requestOpt),
      videos = []

    Object.assign(listOption.qs, {
      key: this.config.apiKey,
      channelId: channel,
    })

    await this.search10(listOption, videos)

    const result = { dirName: dirName, videos: videos }
    await this.writer(result, channel, videoCount, time)

    return result
  }
}
