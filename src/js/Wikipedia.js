const axios = require("axios");
const cheerio = require("cheerio");

async function searchWikipedia(query) {
/*
 * SCRAPE BY @TAN
 * SOURCE https://github.com/Tanmyname-py/scrape/blob/main/src/js/Wikipedia.js
 */
    try {
        const searchUrl = `https://id.m.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}&title=Istimewa:Pencarian&profile=advanced&fulltext=1&ns0=1`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Connection": "keep-alive"
        };
        const { data } = await axios.get(searchUrl, { headers });
        const $ = cheerio.load(data);
        let results = [];

        $(".mw-search-result").each((index, element) => {
            let title = $(element).find(".mw-search-result-heading a").text().trim();
            let url = "https://id.m.wikipedia.org" + $(element).find(".mw-search-result-heading a").attr("href");
            let description = $(element).find(".searchresult").text().trim();
            let imageElement = $(element).find(".searchResultImage-thumbnail img");
            let thumbnail = imageElement.length ? "https:" + imageElement.attr("src") : null;
            results.push({ title, url, description, thumbnail });
        });

        return results.length > 0 ? results : { error: "❌ Tidak ada artikel ditemukan!" };

    } catch (error) {
        return { error: `Gagal mengambil data: ${error.message}` };
    }
}

async function getWikipediaInfo(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);
        const title = $("#firstHeading").text().trim();
        const tagline = $(".tagline").text().trim();

        let thumbnail = $("table.infobox .infobox-image img").attr("src");
        if (thumbnail) {
            thumbnail = "https:" + thumbnail;
        } else {
            thumbnail = "Tidak ada thumbnail";
        }
        let content = [];
        $("#mw-content-text .mw-parser-output p").each((index, element) => {
            const paragraph = $(element).text().trim();
            if (paragraph.length > 0) {
                content.push(paragraph);
            }
        });
        let tableOfContents = [];
        $("#toc ul li").each((index, element) => {
            const sectionTitle = $(element).text().trim();
            if (sectionTitle.length > 0) {
                tableOfContents.push(sectionTitle);
            }
        });
        const sourceUrl = url;

        return {
            title,
            tagline,
            thumbnail,
            tableOfContents,
            content: content.join("\n\n"),
            sourceUrl
        };

    } catch (error) {
        return { error: `Gagal mengambil data: ${error.message}` };
    }
}
