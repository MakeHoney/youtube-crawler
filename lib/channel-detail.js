// Getting channel_detail_info by each channel on YouTube using Youtube Data API v3

const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils')

async function saveData(file, channelId, channelTitle, channelUrl, channelThumbnails, channelViewCount, channelSubscriberCount, channelVideoCount, channelPublishedAt, channelCrawledAt){
  await file.write('{\nchannel_id: ' + channelId + ',\n')
  await file.write('channel_name: ' + channelTitle + ',\n')
  await file.write('channel_url: ' + channelUrl + ',\n')  // get url
  await file.write('channel_thumbnails: ' + channelThumbnails + ',\n')  // can choose default(88), medium(240), high(800)
  await file.write('channel_viewCount: ' + channelViewCount + ',\n')
  await file.write('channel_subscriberCount: ' + channelSubscriberCount + ',\n')
  await file.write('channel_videoCount: ' + channelVideoCount + ',\n')
  await file.write('channel_publishedAt: ' + channelPublishedAt + ',\n')
  await file.write('channel_crawledAt: ' + channelCrawledAt + '\n}')
}

module.exports = async (channel, config = require('config')) => {
  const { api_key, base_url, retryOpt } = config.channelDetail
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
    return Error('empty channel error')
  }
  return Error('invalid channel error')
}