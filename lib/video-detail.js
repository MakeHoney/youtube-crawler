const Collector = require('./collector'),
  deepCopy = require('./deep-copy')

module.exports = class VideoDetail extends Collector {
  reformatter(body, time) {
    const item = body.items[0]

    return {
      videoId: item.id,
      videoTitle: item.snippet.title,
      videoUrl: `http://youtube.com/watch?v=${item.videoId}`,
      videoThumbs: item.snippet.thumbnails.high.url,
      videoCategoryId: item.snippet.categoryId,
      videoViewCount: item.statistics.viewCount,
      videoLikeCount: item.statistics.likeCount,
      videoDislikeCount: item.statistics.dislikeCount,
      videoCommentCount: item.statistics.commentCount,
      videoPublishedAt: item.snippet.publishedAt,
      videoCrawledAt: time,
    }
  }

  async collect(dirName, videoId, time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')) {
    let videoDetailOption = deepCopy(this.config.requestOpt)
    Object.assign(videoDetailOption.qs, {
      key: this.config.apiKey,
      id: videoId,
    })

    let body = await this.retryRequest(videoDetailOption)

    if (body === undefined) throw Error('video request error')
    if (body.items === undefined) throw Error('invalid video error')

    // reformat response & call write function
    const result = this.reformatter(body, time)
    await this.writer(result, dirName, videoId, time)

    return 'done'
  }
}
