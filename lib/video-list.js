const request = require('request-promise'),
  retry = require('async-retry'),
  fs = require('fs'),
  date = require('date-utils'),
  promisify = require('util').promisify
  mkdirp = promisify(require('mkdirp'))

module.exports = async (channel, videoCount, config = require('config')) => {
  /* init variables */
  const { baseUrl, retryOpt, requestOpt } = config.videoList,
    apiKey = config.apiKey,
    initUrl = baseUrl + '&key=' + apiKey + '&channelId=' + channel,
    time = (new Date()).toFormat('YYYY-MM-DDTHH24:MI:SS.000Z'),
    fileName = channel + '-' + time + '_videolist' + '.txt',
    pageList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    loopCount = Math.ceil(videoCount / 500),
    dirName = `${config.rawDir}/video-detail/${channel}-${time}-video-detail/`,
    retryRequest = async option => await retry(async () => {
    const res = await request(option)
      if (typeof res !== 'object' && res.length < 1) new Error('bad response')
      return res
    }, retryOpt)

  let nextPageToken,
    prevPageToken,
    publishedAt,
    mkdirpErr,
    url = initUrl,
    midUrl = initUrl,
    videos = []

  if (videoCount === 0 || videoCount === '0'){
    throw new Error('empty channel error')
  }

  mkdirpErr = await mkdirp(dirName)
  if(mkdirpErr) throw new Error('mkdir fail error')

  let listOption = Object.assign({
    transform: (body, res) => {
      if (res.statusCode === 204) return { total: 0 }
      return body
    },
  }, requestOpt)

  /* search for maximum api by api */
  async function search500(){
    for (const page of pageList){
      listOption.url = url
      let body = await retryRequest(listOption)

      if (body !== undefined && body.items !== undefined){
        for (const item of body.items){
          if (item !== undefined && item.id.videoId !== undefined){
            await videos.push(item.id.videoId)
            console.log('video ' + item.id.videoId + ' fetched')
          }
          nextPageToken = await body.nextPageToken
          publishedAt = await item.snippet.publishedAt
        }
        if (nextPageToken !== 'endPage' && nextPageToken !== undefined)
          url = await midUrl + '&pageToken=' + nextPageToken
        if (nextPageToken === prevPageToken)
          return 'done'
        prevPageToken = nextPageToken
      }

      else {
        if (page < 9) break
        else throw Error('video result page error')
      }
    }

    midUrl = await initUrl + '&publishedBefore=' + publishedAt
    url = midUrl
    nextPageToken = 'endPage'

  }

  for(var i = 0; i < loopCount; i ++){
    const r = await search500()
  }

  return { dirName: dirName, videos: videos }
}
