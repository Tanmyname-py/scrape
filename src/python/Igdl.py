# Instagram Scraper
# Source https://gist.github.com/Tanmyname-py/291f4e5624269e43af499178d7040da3
import requests
import time
import urllib.parse
from bs4 import BeautifulSoup as bs 
def Igdl_py(url):
  '''
  INSTAGRAM DOWNLOADER WITH PYTHON
  INPUT PARAMETER URL INSTAGRAM 
  '''
  try :
   base_api = f'https://savereels.io/api/ajaxSearch'
   post_data = { 
  "q" : url,
  "w" : "",
  "v" : "v2",
  "lang" : "en",
  "cftoken" : ""
  }
   encoded_data = urllib.parse.urlencode(post_data)
   headers = {
  "Content-Type" : "application/x-www-form-urlencoded; charset=UTF-8",
  "Accept" : "*/*",
  "X-Requested-With" : "XMLHttpRequest",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
  }
   Post_data = requests.post(base_api,data=encoded_data, headers=headers)
   if Post_data.status_code == 200 :
      soup = bs(Post_data.text,'html.parser')
      thumb = soup.find('img')
      img = thumb['src']    
      img_url = img.replace('\\"', '') 
      video = soup.find('a')
      vid = video['href']
      vid_url = vid.replace('\\"','')
      return {
       "status" : "success",
       "codeby" : "Tanmyname-py",
       "data" : {
         "thumb" : img_url,
         "dl_url" :  vid_url    
       }
      }
   else :
      return {
      "status" : "eror",
      "message" :  f"Eror with status code {Post_data.status_code}"     
      }
      
  except Exception as e :
    print(f"EROR {e}")
    
    
    
    
if __name__ == '__main__':
  url = input("Masukkan url Instagram : ")
  data = Igdl_py(url)
  print(data)
  url_dl = data['data']['dl_url']
  getvid = requests.get(url_dl)
  with open('ig.mp4','wb') as f :
    f.write(getvid.content
