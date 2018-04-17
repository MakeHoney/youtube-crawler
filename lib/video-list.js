const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils'),
  mkdirp = require('mkdirp')

module.exports = async (channel, videoCount, videoDetail, config = require('config')) => {
  /* init variables */
  const { api_key, base_url, retryOpt } = config.videoList,
    init_url = base_url + '&key=' + api_key + '&channelId=' + channel
  var url = init_url,
    newDate = new Date(),
    time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z'),
    mid_url = init_url
  const file_name = channel + '-' + time + '_videolist' + '.txt'
  var nextPageToken, prevPageToken, publishedAt
  const pageList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const loop_count = Math.floor(videoCount / 500 + 1)
  if (videoCount === 0 || videoCount === '0'){
    return Error('empty channel error')
  }
  const dir_name = './' + channel + '_' + time + '_videoDetail/'
  await mkdirp(dir_name, function(err){
    if (err) return Error('mkdir fail error')
  })

  /* search for maximum api by api */
  async function search500(){
    for (const page of pageList){

      const body = await request({
        url: url,
        json: true,
      })

      if (body !== undefined && body.items !== undefined){
        for (const item of body.items){
          if (item !== undefined && item.id.videoId !== undefined){
            console.log('video ' + item.id.videoId + ' fetched')
            let detailResult = await videoDetail(dir_name, item.id.videoId)
            console.log('video ' + item.id.videoId + ' done')
          }
          nextPageToken = await body.nextPageToken
          publishedAt = await item.snippet.publishedAt
        }
        if (nextPageToken !== 'endPage' && nextPageToken !== undefined)
          url = await mid_url + '&pageToken=' + nextPageToken
        if (nextPageToken === prevPageToken)
          return 'done'
        prevPageToken = nextPageToken
      }

      else {
        if (page < 9) break
        else return Error('video result page error')
      }

    }

    mid_url = await init_url + '&publishedBefore=' + publishedAt
    url = mid_url
    nextPageToken = 'endPage'

  }

  for(var i = 0; i < loop_count; i ++){
    const r = await search500()
  }

  return 'done'
}
