const axios = require('axios');
const cheerio = require('cheerio');

async function scrape10Downloader(videoUrl) {
    const baseUrl = "https://10downloader.com/download?v=";
    const targetUrl = baseUrl + encodeURIComponent(videoUrl);

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Connection': 'keep-alive',
                'Content-Type': 'text/html; charset=UTF-8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Referer': 'https://10downloader.com/',
                'Cookie': 'XSRF-TOKEN=eyJpdiI6InpKVCtjMXZFM1hSOGFvMktYYVk0VFE9PSIsInZhbHVlIjoiK1JtckRySVQzV1ZRR3pZdFpiVVVwVlczUmUwT1JUWnBMbXJnR0hrU1RBQ25na0l1Tis2YnFOSjhBUE4rTFhFdi9PR3BCcDFrZnI1bzRUT3dVK3NmVlN4eHRNZ2ZIREVmRFpjZEowV1JUQUwwWjRveHhNVG54VjA3clNQZzcrK2siLCJtYWMiOiI2NGUyZTU4MDMxODhlMGE0ZDkzZmViN2U1Y2FkNDI1Y2FlZjljNTY0N2EwOGY3NGJiNzA1N2U4NWJiZTlmYzVhIiwidGFnIjoiIn0%3D; 10downloader_session=eyJpdiI6ImJYOWhYWEo4OVdVcmJSTGt2aHNWOEE9PSIsInZhbHVlIjoiZTNGa0s4cnpyOWNrZG9xU01YTzRpblhkbHMwZWZXRlV1SkNvS0J6a0g2c2tkRWhRK0NUVTRTUEw3RG03cXFJc2o2RWZESnJEY2xKeUhVNFdWZlNQcUhrbEhqSFRBcHg0VnhYa2QrRTUrQzNCQWRlOEx3V3UxY3BrYStKQzh5bVUiLCJtYWMiOiJhZjU2N2E4YzAwNGRmZjk4NjdlMTRjNTU4YTI4MDJjNGZiOTM1ZDgwYTQyMzhhYzI2NGFhNzA1NzA3MTYzNmJhIiwidGFnIjoiIn0%3D'
            }
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const title = $('title').text().replace(' - 10Downloader', '').trim();
        const thumbnail = $('.info img').attr('src');
        const videos = [];
        $('.downloadsTable tbody tr').each((_, el) => {
            const quality = $(el).find('td').eq(0).text().trim();
            const format = $(el).find('td').eq(1).text().trim();
            const size = $(el).find('td').eq(2).text().trim();
            const downloadUrl = $(el).find('.downloadBtn').attr('href');

            if (downloadUrl) {
                videos.push({ quality, format, size, url: downloadUrl });
            }
        });

        return { title, thumbnail, videos };
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
}
