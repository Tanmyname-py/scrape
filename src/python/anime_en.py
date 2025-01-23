import requests 
from bs4 import BeautifulSoup as bs 
from random_user_agent.user_agent import UserAgent
from random_user_agent.params import SoftwareName, OperatingSystem
software_names = [SoftwareName.CHROME.value, SoftwareName.FIREFOX.value, SoftwareName.OPERA.value]
operating_systems = [OperatingSystem.WINDOWS.value, OperatingSystem.LINUX.value, OperatingSystem.MAC.value]
user_agent_rotator = UserAgent(software_names=software_names, operating_systems=operating_systems)
from tqdm import tqdm 
from tabulate import tabulate
from colorama import Fore as cl 
from colorama import Back as bg 
from colorama import Style
bg_red = bg.RED
bg_cyan = bg.CYAN
bg_reset = bg.RESET
blue = cl.BLUE 
cyan = cl.CYAN 
yellow = cl.YELLOW 
green = cl.GREEN 
red = cl.RED 
magenta = cl.MAGENTA
white = cl.WHITE
reset = cl.RESET
def animeEn(query) :
    '''
    SEARCH ANIME SUB ID 
    '''
    try :
        headers = {
             "User-Agent": user_agent_rotator.get_random_user_agent()
             }
        response = requests.get(f'https://animeheaven.me/search.php?s={query}',headers=headers)
        if response.status_code == 200 :
             soup = bs(response.text,'lxml')
             img = soup.find_all('img',class_='coverimg')
             url_anim = soup.find_all('div',class_='p1')
             data_anime = []
             data_url = []
             data_title = []
             data_thumb = []
             for urls in url_anim :
               data = 'https://animeheaven.me/' + urls.a['href']
               data_url.append(data)
             for imgs in img :
                  url_img = 'https://animeheaven.me/' + imgs['src']
                  title = imgs['alt']
                  data_title.append(title)
                  data_thumb.append(url_img)
             total = len(data_title)
             for i in range(total) :
               data_anime.append({
                    'title' : data_title[i],
                    'thumb' : data_thumb[i],
                    'url' : data_url[i]
               })
             if total == 0 :
               return {
                   "status" : "eror",
                   "message" : "uknown anime not found"
               }
             else :
               return {
                 "status" : "success",
                  "data" : data_anime
                 }

        else :
             print(f'eror with status code{response.status_code}')
          
    except Exception as e :
            print(f'eror {e}')

def get_detail(url) :
    '''
    Get detail episode anime
    '''
    try :
         headers = {
             "User-Agent": user_agent_rotator.get_random_user_agent()
             }
         response = requests.get(url,headers=headers)
         if response.status_code == 200 :
             soup = bs(response.text,'lxml')
             sinopsis = soup.find('div',class_='infodes c')
             total_eps = soup.find_all('div',class_='inline c2')
             genre = soup.find_all('div',class_='boxitem bc2 c1')
             url_episode = soup.find_all('a',class_='ac3')
             title = soup.find('div',class_='infotitlejp c')
             data_eps = []
             data_genre = []
             data_ts = []
             data_anim = []
             for ts in total_eps :
                 data_ts.append(ts.text)                
             for ge in genre :
                 data_genre.append(ge.text)
             for url in url_episode :
                 link_ep = 'https://animeheaven.me/' + url['href']
                 data_eps.append(link_ep)
             batas = len(data_eps)
             for i in range(batas) :
                 batas-=1
                 data_anim.append({
                     f'{batas+1}' : data_eps[i]
                 })
             print(data_ts)
             return {
                 'title' : title.text,
                 'genre' : data_genre,
                 'sinopsis' : sinopsis.text,
                 'rilis_date' : data_ts[1],
                 'rate' : data_ts[2],
                 'url_eps' : data_anim
             }
             
         else :
             print(f'eror with status code {response.status_code}')

    except Exception as e :
        print(f'eror {e}')
          
def get_anime(url) :
    '''
    download anime from url episode 
    '''
    try :
      headers = {
        "User-Agent": user_agent_rotator.get_random_user_agent()
            }
      response = requests.get(url,headers=headers)
      if response.status_code == 200 :
          soup = bs(response.text,'lxml')
          url_vid = soup.find('video',id='vid')
          source_url = url_vid.find_all('source')
          data_url = []
          for url in source_url :
              data = url['src']
              data_url.append(data)
          data1 = data_url[0]
          response = requests.get(data1,headers=headers,stream=True)
          total_size = int(response.headers.get('content-length', 0))
          with open('anime.mp4', 'wb') as f:
           for data in tqdm(response.iter_content(chunk_size=1024), total=total_size // 1024, unit='KB', desc="Downloading"):
               f.write(data)
    except Exception as e :
        print(f'eror {e}')

def AnimeEn_main():
    print(f"{yellow}Welcome To {red}🅟 {blue}🅨 {green}🅝 {cyan}🅘 {white}🅜 {magenta}🅔 {blue}>_{reset}")
    title = input("Please enter the anime title: ")
    data = animeEn(title)

    if data["status"] == "eror":
        print(f"{red}Error: {data['message']}{reset}")
        return

    anime_list = data["data"]
    table = [[idx + 1, anime["title"], anime["url"]] for idx, anime in enumerate(anime_list)]
    print(tabulate(table, headers=["No", "Title", "URL"], tablefmt="fancy_grid"))

    try:
        choice = int(input(f"{cyan}Choose an anime by entering its number: {reset}"))
        if choice < 1 or choice > len(anime_list):
            print(f"{red}Invalid choice. Exiting...{reset}")
            return

        selected_anime = anime_list[choice - 1]
        url = selected_anime["url"]
        details = get_detail(url)

        print(f"\n{yellow}Anime Details:{reset}")
        print(f"Title: {details['title']}")
        print(f"Genre: {', '.join(details['genre'])}")
        print(f"Synopsis: {details['sinopsis']}")
        print(f"Release Date: {details['rilis_date']}")
        print(f"Rating: {details['rate']}\n")

        eps_table = [[ep_number, list(episode.values())[0]] for ep_number, episode in enumerate(details['url_eps'], 1)]
        print(tabulate(eps_table, headers=["Episode No", "URL"], tablefmt="fancy_grid"))

        ep_choice = int(input(f"{cyan}Choose an episode to download by entering its number: {reset}"))
        if ep_choice < 1 or ep_choice > len(details['url_eps']):
            print(f"{red}Invalid episode choice. Exiting...{reset}")
            return

        selected_episode = list(details['url_eps'][ep_choice - 1].values())[0]
        print(f"{green}Downloading episode {ep_choice}...{reset}")
        get_anime(selected_episode)
        print(f"{green}Download complete!{reset}")

    except ValueError:
        print(f"{red}Invalid input. Exiting...{reset}")
    except KeyError as e:
        print(f"{red}Unexpected data format: {e}{reset}")
