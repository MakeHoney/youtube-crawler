module.exports = {
  m: 100,
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
  },
}
