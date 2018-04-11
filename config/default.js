module.exports = {
  api_key: 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo',
  channelDetail: {
    base_url: 'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics'
  },
  videoList: {
    base_url: 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&order=date&maxResults=50'
  },
  videoDetail: {
    base_url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics'
  }
}
