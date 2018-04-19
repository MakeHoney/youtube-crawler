module.exports = {
  apiKey: '',
  channelDetail: {
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
    requestOpt: {
      url: 'https://www.googleapis.com/youtube/v3/channels',
      qs: {
        part: 'id,snippet,statistics',
      },
      json: true,
    },
    saveData: async function saveData(file, channelId, channelTitle, channelUrl, channelThumbnails, channelViewCount, channelSubscriberCount, channelVideoCount, channelPublishedAt, channelCrawledAt){
      await file.write('{\nchannel_id: ' + channelId + ',\n')
      await file.write('channel_name: ' + channelTitle + ',\n')
      await file.write('channel_url: ' + channelUrl + ',\n')  // get url
      await file.write('channel_thumbnails: ' + channelThumbnails + ',\n')  // can choose default(88), medium(240), high(800)
      await file.write('channel_viewCount: ' + channelViewCount + ',\n')
      await file.write('channel_subscriberCount: ' + channelSubscriberCount + ',\n')
      await file.write('channel_videoCount: ' + channelVideoCount + ',\n')
      await file.write('channel_publishedAt: ' + channelPublishedAt + ',\n')
      await file.write('channel_crawledAt: ' + channelCrawledAt + '\n}')
    },
  },
  videoList: {
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
    requestOpt: {
      url: 'https://www.googleapis.com/youtube/v3/search',
      json: true,
      qs: {
        part: 'id,snippet',
        type: 'video',
        order: 'date',
        maxResults: 50,
      },
    },
  },
  videoDetail: {
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
    requestOpt: {
      url: 'https://www.googleapis.com/youtube/v3/videos',
      qs: {
        part: 'id, snippet, statistics',
      },
      json: true,
    },
    saveData: async function saveData(file, videoId, videoTitle, videoUrl, videoThumbnails, videoCategory, videoViewCount, videoLikeCount, videoDislikeCount, videoCommentCount, videoPublishedAt, videoCrawledAt){
      await file.write('{\nvideo_id: ' + videoId + ',\n')
      await file.write('video_name: ' + videoTitle + ',\n')
      await file.write('video_url: ' + videoUrl + ',\n')  // get url
      await file.write('video_thumbnails: ' + videoThumbnails + ',\n')  // can choose default(88), medium(240), high(800)
      await file.write('video_category: ' + videoCategory + ',\n')
      await file.write('video_viewCount: ' + videoViewCount + ',\n')
      await file.write('video_likeCount: ' + videoLikeCount + ',\n')
      await file.write('video_dislikeCount: ' + videoDislikeCount + ',\n')
      await file.write('video_commentCount: ' + videoCommentCount + ',\n')
      await file.write('video_publishedAt: ' + videoPublishedAt + ',\n')
      await file.write('video_crawledAt: ' + videoCrawledAt + '\n}')
    },
  },
}
