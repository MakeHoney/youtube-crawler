# Youtube Crawler - youtube_videolist_node.js
* Youtube VideoList Crawler by each channel with Node.js, Youtube-API Data v3
* Will keep optimizing(This is a very RAW version)

# How to Use
1. Install Node.js
* Find how to install node.js
2. Install follow libraries
```bash
$ npm install async
$ npm install request
$ npm install fs
$ npm install date
```
3. Get API key for Youtube-API Data v3
4. Enter your API key into code
```javascript
var api_key = 'Enter your API Key';
```
5. Enter your channel's channel id into code
```javascript
var channel_list = ['channel1_id', 'channel2_id'];
```
6. Just run it!
```bash
$ node youtube_videolist_node
```


# Youtube Video Detail Crawler - youtube_videodetail_node.js
* Youtube Video Detail Crawler by each channel's video lists' video id with Node.js, Youtube-API Data v3
* Will keep optimizing & Codes more readable

# How to Use
1. Install Node.js
* Find how to install node.js
2. Install follow libraries
```bash
$ npm install async
$ npm install request
$ npm install fs
$ npm install date
```
3. Get API key for Youtube-API Data v3
4. Enter your API key into code
```javascript
var api_key = 'Enter your API Key';
```
5. Enter your channel's video ids into code
```javascript
var video_list = ['video1_id', 'video2_id'];
```
6. Just run it!
```bash
$ node youtube_videolist_node
```


# Youtube Crawler - youtube_fulldata_python.py
* Youtube Crawler with Python3, BeautifulSoup4

# How to Use
1. Install follow libraries
```bash
$ pip install beautifulsoup(or bs4)
$ pip install lxml
```
2. Just run it!

# Responsible Results
```javascript
{
    'name': 'channel_name',
    'subscribe count': 'channel_subscribe_count',
    'videos info': ['Info of Each Video(video_name, video_viewcount, video_like_count, video_dislike_count, video_date, video_link, video_play_length)']
}
```
