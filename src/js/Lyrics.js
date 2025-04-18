const axios = require("axios");
const cheerio = require("cheerio");

async function getLyricsLinks(songTitle) {
    /*
    * SCRAPE BY @TAN
    * SOURCE https://github.com/Tanmyname-py/scrape/blob/main/src/js/Lyrics.js
    */
    try {
        const searchUrl = `https://search.azlyrics.com/search.php?q=${encodeURIComponent(songTitle)}+&x=8fa766a1094778835fe58c533cfd3498ed4c90216e9272082a5541d725491280`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Connection": "keep-alive"
        };
        const { data } = await axios.get(searchUrl, { headers });
        const $ = cheerio.load(data);
        let results = [];
        $(".panel:contains('Song results') table tr").each((index, element) => {
            let linkElement = $(element).find("td.text-left.visitedlyr a");
            if (linkElement.length > 0) {
                let title = linkElement.find("span b").text().trim();
                let url = linkElement.attr("href");
                results.push({ title,url });
            }
        });
        let albums = [];
        $(".panel:contains('Album results') table tr").each((index, element) => {
            let albumElement = $(element).find("td.text-left.visitedlyr a");
            if (albumElement.length > 0) {
                let albumText = albumElement.find("span b").text().trim();
                let albumUrl = albumElement.attr("href");
                let album = albumText.split(' - "')[1]?.replace('"', "").trim() || "Unknown";
                let artist = albumText.split(' - "')[0]?.trim() || "Unknown";
                albums.push({ album, artist, url: albumUrl });
            }
        });

        return { songs: results, albums: albums };

    } catch (error) {
        return { error: `Gagal mengambil data: ${error.message}` };
    }
}

async function getLyrics(url) {
    try {
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Connection": "keep-alive"
        };
        const { data } = await axios.get(url, { headers });
        const $ = cheerio.load(data);
        let title = $(".div-share h1").text().replace('Lirik lagu "', "").replace('"', "").trim() || "Unknown";
        let artist = $(".lyricsh h2 a").text().trim() || "Unknown";
        let lyrics = $(".ringtone").next("b").nextAll("div").first().html() || "";
        lyrics = lyrics
            .replace(/<br\s*\/?>/g, "\n")
            .replace(/\n{2,}/g, "\n")
            .replace(/<!--.*?-->/gs, "")
            .trim();

        return {
            title: title,
            artist: artist,
            lyrics: lyrics
        };

    } catch (error) {
        return { error: `❌ Gagal mengambil data: ${error.message}` };
    }
}
