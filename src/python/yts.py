import requests
import urllib.parse
from bs4 import BeautifulSoup as bs
import yt_dlp
import json

#query = 'wali yank'

def ytSearch(query):
    encode = urllib.parse.quote(query)
    api = f'https://api.flvto.online/@api/search/YouTube/{encode}'
    headers = {
        'authority' : 'api.flvto.online',
        'scheme':'https',
        'Accept' : '*/*',
        'Accept-Encoding' : 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Origin' : 'https://www-mp3juices.com',
        'Referer' : 'https://www-mp3juices.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    }
    res = requests.get(api,headers=headers)
    if res.status_code == 200 :
        data = res.json()
        total_data = data['items']
        data_thumb = []
        data_chanel = []
        data_title = []
        data_url = []
        id_chanel = []
        date_post = []
        data_duration = []
        data_view = []
        for start in range(len(total_data)) :
            title = total_data[start]['title']
            id = 'https://www.youtube.com/watch?v=' + str(total_data[start]['id'])
            thumb = total_data[start]['thumbHigh']
            channel_name = total_data[start]['channelTitle']
            chanel_id = total_data[start]['channelId']
            post_date = total_data[start]['publishedAt']
            duration = total_data[start]['duration']
            view = total_data[start]['viewCount']         
            data_title.append(title)
            data_thumb.append(thumb)
            data_url.append(id)
            data_chanel.append(channel_name)  
            id_chanel.append(chanel_id)
            date_post.append(post_date)
            data_duration.append(duration)
            data_view.append(view)
        data = []
        for play in range(len(data_title)) :
            if play == len(data_title) :
                break
            result = {
                'title' : data_title[play],
                'thumb' : data_thumb[play],
                'url_yt' : data_url[play],
                'title_Chanel' : data_chanel[play],
                'id_chanel' : id_chanel[play],
                'post' : date_post[play],
                'duration' : data_duration[play],
                'view' : data_view[play] 
            }
            data.append(result)
        return {
            'status' : 'success',
            'codeby' : 'Tanmyname-py',
            'data' : data
        }
