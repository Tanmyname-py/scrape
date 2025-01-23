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
