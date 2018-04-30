const Collector = require('./collector'),
  deepCopy = require('./deep-copy')

module.exports = class ChannelList extends Collector {
  // search for maximum api by api
  async search500(listOption, videos) {
    let publishedAt

    for (let page = 0; page < 10; page++) {
      let body = await this.retryRequest(listOption),
        nextPageToken = body.nextPageToken,
        prevPageToken

      // check response
      if (body === undefined || body.items === undefined || body.items.length < 1){
        if (page < 9) break
        else throw Error('video result page error')
      }

      // push video id on videos array
      for (let item of body.items){
        if (item !== undefined && item.id.videoId !== undefined){
          videos.push(item.id.videoId)
          console.log('video ' + item.id.videoId + ' fetched')
        }
        publishedAt = item.snippet.publishedAt
      }

      // if next page exist make api call to next page
      if (nextPageToken !== undefined) listOption.qs.pageToken = nextPageToken
      if (nextPageToken === prevPageToken) break
      prevPageToken = nextPageToken
    }

    // for next 500 videos
    listOption.qs.publishedBefore = publishedAt
    delete listOption.qs.pageToken
  }

  async collect(channel, videoCount, time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')) {
    const loopCount = Math.ceil(videoCount / 500),
      dirName = `${this.config.rawDir}/video-detail/${channel}-${time}-video-detail/`

    if (videoCount === 0 || videoCount === '0') throw new Error('empty channel error')

    // copy config request option & add qs params
    let listOption = deepCopy(this.config.requestOpt),
      videos = []

    Object.assign(listOption.qs, {
      key: this.config.apiKey,
      channelId: channel,
    })

    for(let i = 0; i < loopCount; i ++){
      await this.search500(listOption, videos)
    }

    const result = { dirName: dirName, videos: videos }
    await this.writer(result, channel, videoCount, time)

    return result
  }
}

// module.exports = async (channel, videoCount, config = require('config')) => {
//   /* init variables */
//   const { retryOpt, requestOpt } = config.videoList,
//     apiKey = config.apiKey,
//     time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z'),
//     fileName = channel + '-' + time + '_videolist' + '.txt',
//     pageList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
//     loopCount = Math.ceil(videoCount / 500),
//     dirName = `${config.rawDir}/video-detail/${channel}-${time}-video-detail/`,
//     retryRequest = async option => await retry(async () => {
//     const res = await request(option)
//       if (typeof res !== 'object' && res.length < 1) new Error('bad response')
//       return res
//     }, retryOpt)

//   let nextPageToken,
//     prevPageToken,
//     publishedAt,
//     mkdirpErr,
//     videos = []

//   if (videoCount === 0 || videoCount === '0'){
//     throw new Error('empty channel error')
//   }

//   mkdirpErr = await mkdirp(dirName)

//   // copy config request option & add qs params
//   let listOption = deepCopy(requestOpt)
//   Object.assign(listOption.qs, {
//     key: apiKey,
//     channelId: channel,
//   })

//    search for maximum api by api
//   async function search500(){
//     for (let page of pageList){
//       let body = await retryRequest(listOption)

//       if (body !== undefined && body.items !== undefined && body.items.length > 0){
//         for (let item of body.items){
//           if (item !== undefined && item.id.videoId !== undefined){
//             videos.push(item.id.videoId)
//             console.log('video ' + item.id.videoId + ' fetched')
//           }
//           nextPageToken = body.nextPageToken
//           publishedAt = item.snippet.publishedAt
//         }
//         if (nextPageToken !== undefined)
//           listOption.qs.pageToken = nextPageToken
//         if (nextPageToken === prevPageToken)
//           break
//         prevPageToken = nextPageToken
//       } else {
//         if (page < 9) break
//         else throw Error('video result page error')
//       }
//     }

//     // for next 500 videos
//     listOption.qs.publishedBefore = publishedAt
//     delete listOption.qs.pageToken
//   }

//   for(let i = 0; i < loopCount; i ++){
//     await search500()
//   }

//   return { dirName: dirName, videos: videos }
// }
