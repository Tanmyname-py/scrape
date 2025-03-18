# Ytdl scraper
import requests
import json 
def Ytdl(url):
    api_url = "https://allvideodownloader.cc/wp-json/aio-dl/video-data/"
    payload = {"url": url}

    try:
        response = requests.post(api_url, json=payload)
        response.raise_for_status()  
        if response.status_code == 200:
            data = response.json()
            title = data.get('title')
            thumbnail = data.get('thumbnail')
            duration = data.get('duration')
            list_dl = data.get('medias')
            return {
              'status' : 'sucess',
                 'data' : {
                     'title' : title,
                     'thumbnail' : thumbnail,
                     'duration' : duration,
                       'list_url' : list_dl
                        }        
              }
        else:
          return {
          'status' : 'eror',
          'message' : f'eror with status code {response.status_code}'
          }

    except requests.exceptions.RequestException as e:
        return f"Error: {e}"

if __name__ == "__main__":
    video_url = input("Masukkan URL YouTube: ")
    print(json.dumps(Ytdl(video_url),indent=2)
