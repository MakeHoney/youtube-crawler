const Collector = require('./collector'),
  deepCopy = require('./deep-copy')

module.exports = class CommentDetail extends Collector {
  reformatter(body, time, comments) {
    const item = body.items,
      pageToken = body.nextPageToken

    //let comments = []

    for(let comment of item){
      const result = {
        commentId: comment.id,
        commentAuthorName: comment.snippet.topLevelComment.snippet.authorDisplayName,
        commentAuthorThumbs: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
        commentText: comment.snippet.topLevelComment.snippet.textOriginal,
        commentLikeCount: comment.snippet.topLevelComment.snippet.likeCount,
        videoId: comment.snippet.topLevelComment.snippet.videoId,
        commentPublishedAt: comment.snippet.topLevelComment.snippet.publishedAt,
        commentCrawledAt: time,
      }

      comments.push(result)
    }

    return pageToken
  }

  async collect(dirName, video, time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')) {
    let comments = []

    let commentDetailOption = deepCopy(this.config.requestOpt)
    Object.assign(commentDetailOption.qs, {
      key: this.config.apiKey,
      videoId: video,
    })

    // request & error check
    let body = await this.retryRequest(commentDetailOption)

    // reformat response & call write function
    let pageToken = await this.reformatter(body, time, comments)

    if(pageToken !== undefined){
          Object.assign(commentDetailOption.qs, {
            pageToken: pageToken,
          })

          let body2 = await this.retryRequest(commentDetailOption)
          let pageToken2 = await this.reformatter(body2, time, comments)

          if(pageToken2 !== undefined){
            Object.assign(commentDetailOption.qs, {
              pageToken: pageToken2,
            })

            let body3 = await this.retryRequest(commentDetailOption)
            let pageToken3 = await this.reformatter(body3, time, comments)

            if(pageToken3 !== undefined){
              Object.assign(commentDetailOption.qs, {
                pageToken: pageToken3,
            })

            let body4 = await this.retryRequest(commentDetailOption)
            let pageToken4 = await this.reformatter(body4, time, comments)

            if(pageToken4 !== undefined){
              Object.assign(commentDetailOption.qs, {
                pageToken: pageToken4,
              })

            let body5 = await this.retryRequest(commentDetailOption)
            let pageToken5 = await this.reformatter(body5, time, comments)
          }
        }
      }
    }

    await this.writer(comments, dirName, video, time)
    return "done"
  }
}
