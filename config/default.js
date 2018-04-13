module.exports = {
  channelDetail: {
    api_key: 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo',
    base_url: 'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics',
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
  },
  videoList: {
    api_key: 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo',
    base_url: 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&order=date&maxResults=50',
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
  },
  videoDetail: {
    api_key: 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo',
    base_url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics',
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
  }
}
