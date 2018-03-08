# Youtube Data Crawling Codes
# Goal is to get channel's info, each channel's video's info

# Data Structure will be like this;
# name: 'channel name', subscribe_count: 'channel's total subscribe count', videos_info: ['Each Video's Info']

# Example:
# channel_list = [{'name': 'TaeBbong', 'subscribe_count': '94234',
# 'videos_info': [{'title': 'How to write Paper well', 'video_link': 'https://youtube.com/asdfasd',
# 'play_length': '12:32', 'view_count': '123123', ... }, {}]


from bs4 import BeautifulSoup
import lxml
import requests
import re

## hihihihihih

# Getting Info from Channel
def get_channel_info(target_url):
    # Connect to Channel URL
    response = requests.get(target_url)
    soup = BeautifulSoup(response.text, "lxml")
    videos = []

    # Get Subscribe Count
    lis = soup.find_all('span', {'class': 'channel-header-subscription-button-container yt-uix-button-subscription-container with-preferences'})
    for span in lis:
        subscribe_count = span.find('span', {'title': True})['title']

    # Get Channel Name
    lis = soup.find_all('a', {'class': 'spf-link branded-page-header-title-link yt-uix-sessionlink'})
    for a in lis:
        name = a.get('title')

    # Get Channel's video list on tab 'video'
    lis = soup.find_all('li', {'class': 'channels-content-item yt-shelf-grid-item'})
    for li in lis:
        # Get Video's title, link, length, viewcount, uploaded date
        title = li.find('a', {'title': True})['title']
        video_link = 'https://www.youtube.com' + li.find('a', {'href': True})['href']
        play_length = li.find('span', {'class': 'video-time'}).text
        view_count = li.find_all('li')[2].text
        uploaded_date = li.find_all('li')[3].text

        # Make Video Info Dictionary
        video = {
            'title': title,
            'video_link': video_link,
            'play_length': play_length,
            'view_count': view_count,
            'uploaded_date': uploaded_date
        }
        # Append to videos list
        videos.append(video)

    # Make Channel Info Dictionary
    channel_info = {'name': name, 'subscribe_count': subscribe_count, 'videos_info': videos}
    return channel_info


# Getting Info from Video
def get_video_info(target_url):
    # Connect to Video URL
    response = requests.get(target_url)
    soup = BeautifulSoup(response.text, "lxml")

    # Get Like, Dislike Count
    lis = soup.find_all('button', {'aria-label':True})
    count = -1
    for li in lis:
        s = str(li.find_all('span', {'class': 'yt-uix-button-content'}))
        count += 1
        # Like Count is on 8th li, and Dislike is on 10th
        if count == 8:
            like = re.sub('[^0-9]', '', s)
        if count == 10:
            dislike = re.sub('[^0-9]', '', s)

    return like, dislike


# Total Channel Info List
channel_list = []
# Total Channel's URL List
url_list = ['http://www.youtube.com/channel/UCUXYT0CqvBx1ZysmxSW7EDQ/videos']

# Get Channel Info from each Channel's URL
for url in url_list:
    channel = get_channel_info(url)
    videos_info = []
    for video in channel['videos_info']:
        video_url = video['video_link']
        like, dislike = get_video_info(video_url)
        video['like'] = like
        video['dislike'] = dislike

    channel_list.append(channel)

print(channel)