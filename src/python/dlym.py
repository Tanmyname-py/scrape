import requests
def Dly_py(video_url):
    api_url = "https://api.v02.savethevideo.com/tasks"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    payload = {
        "type": "info",
        "url": video_url
    }

    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()  
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}
