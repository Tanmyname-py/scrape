const axios = require("axios");
const cheerio = require("cheerio");

async function getLyricsLinks(songTitle) {
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
                let artist = linkElement.html().split("</b> - <b>")[1]?.replace("</b></a>", "").trim() || "Unknown";
                results.push({ title, artist, url });
            }
        });

        // Ambil hasil album
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


