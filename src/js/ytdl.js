const axios = require('axios');
const cheerio = require('cheerio');

async function ytdl(videoUrl) {
    const baseUrl = "https://10downloader.com/download?v=";
    const targetUrl = baseUrl + encodeURIComponent(videoUrl);

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Connection': 'keep-alive',
                'Content-Type': 'text/html; charset=UTF-8',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Referer': 'https://10downloader.com/
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
