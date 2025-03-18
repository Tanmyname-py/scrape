import requests
from bs4 import BeautifulSoup

import json
def Sncv_py(url: str):
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "text/html-partial, */*; q=0.9",
        "X-IC-Request": "true",
        "X-HTTP-Method-Override": "POST",
        "X-Requested-With": "XMLHttpRequest"
    }
    
    payload = {
        "ic-request": "true",
        "id": url,
        "locale": "id",
        "ic-element-id": "main_page_form",
        "ic-id": "1",
        "ic-target-id": "active_container",
        "ic-trigger-id": "main_page_form",
        "ic-current-url": "/id",
        "ic-select-from-response": "#id1",
        "_method": "POST"
    }
    
    response = requests.post("https://getsnackvideo.com/results", headers=headers, data=payload)
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")        
        thumb = soup.find('div',class_='img_thumb')
        url_thumb = thumb.find('img')['src']
        vid = soup.find('a',class_='btn btn-primary download_link without_watermark')
        return {
         'status' : 'sucess',
         'data' : {
         'thumb' : url_thumb,
         'urldl' : vid['href']
         }        
        }
    else:
        return {"error": f"Gagal mengambil data, status code: {response.status_code}"}

if __name__ == '__main__':
    # Contoh penggunaan
    video_data = Sncv_py("https://m.snackvideo.com/on/snack/share?userId=150000613878182&photoId=5190548569856117543")
    print(json.dumps(video_data,indent=2)
