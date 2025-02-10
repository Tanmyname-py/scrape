const axios = require("axios");
const cheerio = require("cheerio");

async function getTenorGifs(query) {
/*
 * SCRAPE BY @TAN
 * SOURCE https://github.com/Tanmyname-py/scrape/edit/main/src/js/Tenor.js
*/
    try {
        const searchUrl = `https://tenor.com/id/search/${encodeURIComponent(query)}-gifs`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Connection": "keep-alive"
        };
        const { data } = await axios.get(searchUrl, { headers });
        const $ = cheerio.load(data);

        let results = [];

        $(".UniversalGifListItem a div.Gif img").each((index, element) => {
            let gifUrl = $(element).attr("src");
            if (gifUrl) {
                let title = gifUrl.split("/").pop().replace(".gif", "");
                results.push({ title: title.replace(/-/g, " "), url: gifUrl });
            }
        });

        return results;

    } catch (error) {
        return { error: `Gagal mengambil data: ${error.message}` };
    }
}
