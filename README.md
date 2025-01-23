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
