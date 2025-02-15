import requests
import urllib.parse
from bs4 import BeautifulSoup as bs

def Ttdl_py(url):
   '''
   TIKTOK DOWNLOADER WITH PYTHON
   INPUT PARAMETER URL TIKTOK
   Example use code
   url = "Your ourl url tiktok"
   data = Ttdl_py(url)
   print(data)
   '''
   try :
    Url_search = f'https://www.tiktok.com/oembed?url={url}'  
    print(f"Get data : {url}")
    respon = requests.get(Url_search)
    if respon.status_code == 200:
      data = respon.json()
      Get_url = data['html']
      soup = bs(Get_url,'html.parser')
      bq = soup.find('blockquote')
      Url_tt = bq['cite']
      print("Start scrape....")
      apiUrl = "https://ssstik.io/abc"
      headers = {
       "HX-Request" : "true",
       "HX-Trigger" : "_gcaptcha_pt",
       "HX-Target" : "target",
       "HX-Current-URL" : "https://ssstik.io/en",
       "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
        }
      data = { 
       "id": Url_tt, 
       "locale": "en", 
       "tt": "RjlGOHU_"
       } 
      encoded_data = urllib.parse.urlencode(data)
      post_data = requests.post(apiUrl,data=encoded_data,headers=headers)
      if post_data.status_code == 200 :
        soup = bs(post_data.text,'html.parser')
        title = soup.find('p',class_="maintext")
        thumb = soup.find("img",class_="result_author")
        mp4 = soup.find("a",class_="pure-button pure-button-primary is-center u-bl dl-button download_link without_watermark vignette_active notranslate")
        mp3 = soup.find("a",class_= "pure-button pure-button-primary is-center u-bl dl-button download_link music vignette_active notranslate")
        return { 
          "status" : "succces",
          "codeby" : "Tanmyname-py",
          "data" : {
          "title" : title.text,
          "thumb" : thumb["src"],
          "video_url" : mp4["href"],
          "audio_url" : mp3["href"]
          }                   
          }  
          
      else :
        return { 
        "status" : "eror",
        "message" : f"Eror with status code {post_data.status_code}"    
        }
    else :
      return f'Eror with status code {respon.status_code}'  
   except Exception as e :
     return f'Eror {e}'
     
     
if __name__ == '__main__':
  url_tt = input("Masukkan url ")
  data = Ttdl_py(url_tt)
  print(data)
