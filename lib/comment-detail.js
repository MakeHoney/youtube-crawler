const Collector = require('./collector'),
  deepCopy = require('./deep-copy')

module.exports = class CommentDetail extends Collector {
  reformatter(body, time) {
    const item = body.items,
      pageToken = body.nextPageToken

    let comments = []

    for(let comment of item){
      const result = {
        commentId: comment.id,
        commentAuthorName: comment.snippet.topLevelComment.snippet.authorDisplayName,
        commentAuthorThumbs: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
        commentText: comment.snippet.topLevelComment.snippet.textOriginal,
        commentLikeCount: comment.snippet.topLevelComment.snippet.authorDisplayName,
        videoId: comment.snippet.topLevelComment.snippet.videoId,
        commentPublishedAt: comment.snippet.topLevelComment.snippet.authorDisplayName.publishedAt,
        commentCrawledAt: time,
      }

      comments.push(result)
    }

    let commentDetailOption = deepCopy(this.config.requestOpt)
    Object.assign(commentDetailOption.qs, {
      pageToken: pageToken,
    })

    for(let comment of item){
      const result = {
        commentId: comment.id,
        commentAuthorName: comment.snippet.topLevelComment.snippet.authorDisplayName,
        commentAuthorThumbs: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
        commentText: comment.snippet.topLevelComment.snippet.textOriginal,
        commentLikeCount: comment.snippet.topLevelComment.snippet.authorDisplayName,
        videoId: comment.snippet.topLevelComment.snippet.videoId,
        commentPublishedAt: comment.snippet.topLevelComment.snippet.authorDisplayName.publishedAt,
        commentCrawledAt: time,
      }

      comments.push(result)
    }

    return comments
  }

  async collect(dirName, video, time = (new Date()).toFormat('YYYY-MM-DDTHH24-MI-SS.000Z')) {
    let commentDetailOption = deepCopy(this.config.requestOpt)
    Object.assign(commentDetailOption.qs, {
      key: this.config.apiKey,
      videoId: video,
    })

    // request & error check
    let body = await this.retryRequest(commentDetailOption)

    // reformat response & call write function
    const result = this.reformatter(body, time)
    await this.writer(result, dirName, video, time)

    return "done"
  }
}
