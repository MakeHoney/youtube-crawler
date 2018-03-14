# Youtube Data Crawling Codes
# Goal is to get channel's info, each channel's video's info

# Data Structure will be like this;
# Example:
"""
    channel_info{
        channel_id: ... ,
        channel_name: ... ,
        channel_url: ... ,
        channel_category: ... ,
        channel_follower_count: ... ,
        channel_view_count: ... ,
        channel_sign_date: ... ,
        channel_crawl_date: ... ,
        channel_videos: [video1_info, video2_info, ... ]
    }

    video_info{
        video_id: ... ,
        video_name: ... ,
        video_url: ... ,
        video_category: ... ,
        video_view_count: ... ,
        video_like_count: ... ,
        video_dislike_count: ... ,
        video_comment_count: ... ,
        video_length: ... ,
        video_upload_date: ... ,
        video_crawl_date: ...
    }
"""


from bs4 import BeautifulSoup
import lxml
import requests
import re
from datetime import datetime


# Getting Info from Channel
def get_channel_info(target_url):
    # Connect to Channel URL
    response = requests.get(target_url + '/video')
    soup = BeautifulSoup(response.text, "lxml")
    channel_videos = []

    # Get channel_follower_count
    lis = soup.find_all('span', {'class': 'channel-header-subscription-button-container yt-uix-button-subscription-container with-preferences'})
    for span in lis:
        channel_follower_count = span.find('span', {'title': True})['title']

    # Get channel_name
    lis = soup.find_all('a', {'class': 'spf-link branded-page-header-title-link yt-uix-sessionlink'})
    for a in lis:
        channel_name = a.get('title')

    # Get channel_category, channel_view_count, channel_sign_date, channel_crawl_date
    crawl_date = str(datetime.now().year) + '-' + str(datetime.now().month) + '-' + str(datetime.now().day)

    ''' # Will Join API to find all videos' info
    # Get Channel's video list on tab 'video'
    lis = soup.find_all('li', {'class': 'channels-content-item yt-shelf-grid-item'})
    for li in lis:
        # Get Video's title, link, length, viewcount, uploaded date
        video_name = li.find('a', {'title': True})['title']
        video_url = 'https://www.youtube.com' + li.find('a', {'href': True})['href']
        video_length = li.find('span', {'class': 'video-time'}).text
        video_view_count = li.find_all('li')[2].text
        video_upload_date = li.find_all('li')[3].text

        # Make Video Info Dictionary
        video_info = {
            'video_name': video_name,
            'video_url': video_url,
            'video_view_count': video_view_count,
            'video_length': video_length,
            'video_upload_date': video_upload_date,
            'video_crawl_date': crawl_date
        }
        # Append to videos list
        channel_videos.append(video_info)
    '''

    # Get channel_view_count, sign_date
    response = requests.get(target_url + '/about')
    soup = BeautifulSoup(response.text, "lxml")

    li = soup.find_all('span', {'class': 'about-stat'})[1]
    channel_view_count = str(li.find_all('b'))[4:-5]

    li = soup.find_all('span', {'class': 'about-stat'})[2]
    channel_sign_date = str(li)[30:-7]

    # Make Channel Info Dictionary
    channel_info = {
        'channel_name': channel_name,
        'channel_url': target_url,
        #'channel_category': channel_category, # Determine by Nearest Video's category
        'channel_follower_count': channel_follower_count,
        'channel_view_count': channel_view_count,
        'channel_sign_date': channel_sign_date,
        'channel_crawl_date': crawl_date,
        'channel_videos': channel_videos
    }
    return channel_info


# Getting Info from Video
def get_video_info(target_url):
    # Connect to Video URL
    response = requests.get(target_url)
    soup = BeautifulSoup(response.text, "lxml")

    # Get video_category, video_comment_count -> api
    li = soup.find_all('h4', {'class': 'title'})[0]
    video_category = str(li)[25:-10]

    # Get video_like_count, video_dislike_count
    lis = soup.find_all('button', {'aria-label':True})
    count = -1
    for li in lis:
        s = str(li.find_all('span', {'class': 'yt-uix-button-content'}))
        count += 1
        # Like Count is on 8th li, and Dislike is on 10th
        if count == 8:
            video_like_count = re.sub('[^0-9]', '', s)
        if count == 10:
            video_dislike_count = re.sub('[^0-9]', '', s)

    return video_category, video_like_count, video_dislike_count


# Total Channel Info List
channel_list = []
# Total Channel's URL List
url_list = ['http://www.youtube.com/channel/UCUXYT0CqvBx1ZysmxSW7EDQ']

# Get Channel Info from each Channel's URL
for url in url_list:
    channel_info = get_channel_info(url)
    for video_info in channel_info['channel_videos']:
        video_url = video_info['video_url']
        category, like, dislike = get_video_info(video_url)
        video_info['video_category'] = category
        video_info['video_like_count'] = like
        video_info['video_dislike_count'] = dislike

    channel_list.append(channel_info)

print(channel_list)