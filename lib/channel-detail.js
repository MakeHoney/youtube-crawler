const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils')

module.exports = async (channel, config = require('config')) => {
  const { api_key, base_url, retryOpt, saveData } = config.channelDetail
  const url = base_url + '&key=' + api_key + '&id=' + channel
  var newDate = new Date()
  var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z')
  const file_name = channel + '-' + time + '_channeldetail' + '.txt'

  const body = await request({
    url: url,
    json: true,
  })

  if (body !== undefined){
    if (body.items[0].statistics.videoCount !== '0'){
      var file = await fs.createWriteStream(file_name)
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
  return Error('invalid channel error')
}
