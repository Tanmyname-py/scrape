# Code scrape with python and js 

## Scraper image and video to url 

__Install library npm__

1. axios
2. form-data
3. fs

__example use code__
```javascript
const { uploadToTop4Top } = require('./top4top');

(async () => {
    try {
        const filePath = './t.png';
        const urls = await uploadToTop4Top(filePath);
        console.log('File berhasil diupload. URL:');
        urls.forEach((url, index) => console.log(`URL ${index + 1}: ${url}`));
    } catch (error) {
        console.error('Gagal mengupload file:', error.message);
    }
})();

```
### Scrape anime sub en 

__install library pip__
1. requests
2. beautifulsoup4
3. colorama
4. tqdm
5. tabulate
6. random-user-agent
7. lxml

__example use code__

**1. Search anime**
```python
#Search anime
from anime_en import animeEn,get_detail,get_anime
title = 'Kubo-san wa Mob wo Yurusanai'
data = animeEn(title)
print(data)
```
__Result__
```json
{
  "status": "success",
  "data": [
    {
      "title": "Kubo Won't Let Me Be Invisible",
      "thumb": "https://animeheaven.me/image.php?e11oh",
      "url": "https://animeheaven.me/anime.php?5jhj5"
    }
  ]
}
```
**2. Get detail anime**
```python
from anime_en import animeEn,get_detail,get_anime
title = r'Kubo-san wa Mob wo Yurusanai'
data = animeEn(title)
url = data['data'][0]['url']
data_eps = get_detail(url)
```
__Result__
```json
{
  "title": "Kubo-san wa Mob wo Yurusanai",
  "genre": [
    "Comedy",
    "Opposites Attract",
    "Romance",
    "Romantic",
    "School Life",
    "Seinen",
    "Based On A Manga"
  ],
  "sinopsis": "First year high schooler Junta Shiraishi is a mob character who goes unnoticed even when he's standing right next to you. But his classmate, \"heroine-level beauty\" Kubo, always notices him and is there to tease him. Anyone can become special to someone, but it might be a little too early to call these feelings \"love.\" Perhaps this story is still two-steps from being a romantic comedy--let's call it a sweet comedy where a background character becomes visible!",
  "rilis_date": "2023",
  "rate": "7.6/10",
  "url_eps": [
    {
      "12": "https://animeheaven.me/episode.php?eac9fa5c577d76992b9b7add1d893662"
    },
    {
      "11": "https://animeheaven.me/episode.php?eafa5629315ff8ee31b71accc9c84137"
    },
    {
      "10": "https://animeheaven.me/episode.php?66fd12759bfe1c9de267fa711b458c8c"
    },
    {
      "9": "https://animeheaven.me/episode.php?395a94c7b6a7a0375d17bba25ae56bb6"
    },
    {
      "8": "https://animeheaven.me/episode.php?f61d7df34b323f6cefedca9cce46f810"
    },
    {
      "7": "https://animeheaven.me/episode.php?a3a17129df20f3a1613fd0a1ec87ec24"
    },
    {
      "6": "https://animeheaven.me/episode.php?5d7e8e5b175c7337fe8c13d4865a6c62"
    },
    {
      "5": "https://animeheaven.me/episode.php?8a408ea48ac0d1097d743df72a760ada"
    },
    {
      "4": "https://animeheaven.me/episode.php?64b8f96c119401bbcea63a0e4d492a2c"
    },
    {
      "3": "https://animeheaven.me/episode.php?a982dc6fb1a04e13abad5dd1b219536e"
    },
    {
      "2": "https://animeheaven.me/episode.php?110a23f80b1f9a7c45f6e9986cee0a38"
    },
    {
      "1": "https://animeheaven.me/episode.php?44d2fd9a1b2f5513632f2ee2a0505c94"
    }
  ]
}
```
**3. Download anime**
```python
from anime_en import animeEn,get_detail,get_anime
title = r'Kubo-san wa Mob wo Yurusanai'
data = animeEn(title)
url = data['data'][0]['url']
data_eps = get_detail(url)
get_anime(data_eps['url_eps'][-1]['1'])
```

**4. take it easily**
```python
from anime_en import AnimeEn_main
AnimeEn_main()
```
#### Scrape Downloader Tiktok with js 

__Install library npm__
1.axios

 __example use code__
 ```javascript
const { tiktok } = require('./tiktok'); // import modul

(async () => {
    try {
        const urltt = 'https://vm.tiktok.com/ZS6sCeCG8/';
        const urls = await tiktok(urltt);
        console.log(urls);
    } catch (error) {
        console.error('Eror : ', error.message);
    }
})();

```
__Result__
```json
{
  "title": "Rin chan😣#漫画が読めるハッシュタグ#ゆるキャン△",
  "cover": "https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/oYbAfBEFohDDRQQiYjabFwsBf6JAdmIEVjE6RJ~tplv-tiktokx-cropcenter:300:400.jpeg?dr=14579&nonce=64125&refresh_token=33c243c4f16b1004a1f5df6fde8884e7&x-expires=1737774000&x-signature=2J06IYtHDeB4YncJpWXnY8cfPdo%3D&idc=maliva&ps=13740610&s=AWEME_DETAIL&shcp=34ff8df6&shp=d05b14bd&t=4d5b0474",
  "origin_cover": "https://p16-sign-va.tiktokcdn.com/tos-maliva-p-0068/cbd103a6eb8e48ebb737c2bd234ef79b_1718376083~tplv-tiktokx-360p.image?dr=14555&nonce=25034&refresh_token=31181ec09a955f080d64c44cb6f46a66&x-expires=1737774000&x-signature=ScUpV5NzBe6ap08RNJfJ%2B5BZ0HM%3D&ftpl=1&idc=maliva&ps=13740610&s=AWEME_DETAIL&shcp=34ff8df6&shp=d05b14bd&t=4d5b0474",
  "no_watermark": "https://v16m-default.akamaized.net/2983ad4a6c007d7896b23444cb98bc67/67935b25/video/tos/useast2a/tos-useast2a-pve-0068/oAjsYmRjEU7FAFg5bQJIxQBVZ6CbBfD6EEpfRi/?a=0&bti=OUBzOTg7QGo6OjZAL3AjLTAzYCMxNDNg&ch=0&cr=0&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C0&cv=1&br=2236&bt=1118&cs=0&ds=6&ft=XE5bCqT0majPD12ZiZXJ3wUOx5EcMeF~O5&mime_type=video_mp4&qs=0&rc=ODY1NGdkZzczOTs0Omg6NUBpams5dHc5cmg4czMzNzczM0AvYzVgYDYwXzQxLTVhMmJgYSNjbzM1MmRrYGpgLS1kMTZzcw%3D%3D&vvpl=1&l=20250124031912C019A816DF07555D15FE&btag=e000b8000",
  "watermark": "https://v16m-default.akamaized.net/af1c8a8ff600bf4943bed43e0688c675/67935b25/video/tos/maliva/tos-maliva-ve-0068c801-us/okRgQQDfmtBN9ijsB6FEQYD6EbARNlOEIjfbJF/?a=0&bti=OUBzOTg7QGo6OjZAL3AjLTAzYCMxNDNg&ch=0&cr=0&dr=0&er=0&lr=all&net=0&cd=0%7C0%7C0%7C0&cv=1&br=2598&bt=1299&cs=0&ds=3&ft=XE5bCqT0majPD12ZiZXJ3wUOx5EcMeF~O5&mime_type=video_mp4&qs=0&rc=aGc5NmRlZTlkNTlpOTdlZEBpams5dHc5cmg4czMzNzczM0BjYDEuMTMwXzYxMS1hL2MuYSNjbzM1MmRrYGpgLS1kMTZzcw%3D%3D&vvpl=1&l=20250124031912C019A816DF07555D15FE&btag=e000b8000",
  "music": "https://sf16-ies-music-va.tiktokcdn.com/obj/tos-useast2a-ve-2774/oU5sBiwnIszHsOWyMAZOnoitgLBgdAfL8VBWuR"
}
```
