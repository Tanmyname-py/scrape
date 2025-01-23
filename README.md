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

