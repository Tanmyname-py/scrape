import requests
from bs4 import BeautifulSoup as bs
import json 
class Animepy:
    
    def __init__(self,query='yui hirasawa'):
        self.query = query
   
    @property  
    def Mal(self):
        try:
            base_url = f"https://myanimelist.net/anime.php?q=Amagami&cat={self.query}"
            response = requests.get(base_url)
            if response.status_code == 200:
                soup = bs(response.text,'html.parser')
                res_url = soup.find_all('a',class_='hoverinfo_trigger fw-b fl-l')
                title = []
                source_url = []
                data_anime = []
                for data in res_url:
                    title.append(data.text)
                    source_url.append(data['href'])             
                for index in  range(len(title)):
                   data_anime.append({
                    'title' : title[index],
                   'source_url' : source_url[index]
                   })
                return {
                   'status' : 'success',
                   'data' : data_anime                                 
                 }
            else :
                return {
                 'status' : f'eror with status code {response.status_code}',
                                 
                }                 
        except Exception as e:
            return f"Eror {e}"
            
            
    def Mald(self,url):
            try:
                get_img = requests.get(str(url)+'/pics')
                soups = bs(get_img.text,'html.parser')
                url_img = soups.find_all('a',class_='js-picture-gallery')
                data_thumb = []
                for list_url in url_img :
                    data_thumb.append(list_url['href'])
                res = requests.get(url)
                if res.status_code == 200:
                    soup = bs(res.text,'html.parser')
                    detail_title = soup.find('h1',class_='title-name').text
                    detail_anime = soup.find_all('div',class_='spaceit_pad')
                    information = []
                    for list_anim in detail_anime:
                        information.append(list_anim.text.strip().replace('\n',''))               
                    return {
               'status' : 'success',
               'data' : {
                'title' : detail_title,
                'thumb' : data_thumb,
                'information' : information  }  }
                else :
                    return { 
                    'status' : f'Eror with status code {res.status_code}'                    
                    }                                
            except Exception as e:
                return f'Eror {e}'       
            
