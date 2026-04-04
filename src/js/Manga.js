import axios from "axios";
import * as cheerio from "cheerio";
const { load } = cheerio;
import { decompress } from "@mongodb-js/zstd";

async function getManga(title) {
  const req = await axios({
    url: `https://api.komiku.org/?post_type=manga&s=${title}`,
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    },
    decompress: false,
    responseType: "arraybuffer",
  }).catch((err) => console.log(err));
  if (req.status === 200) {
    const dec = await decompress(req.data);
    const $ = load(dec.toString("utf-8"));
    const titleManga = [];
    const thumbs = [];
    const urlsManga = [];
    $(".bge").each((_, el) => {
      titleManga.push($(el).find("h3").text());
      thumbs.push($(el).find("img").attr("src"));
      urlsManga.push($(el).find(".kan a").attr("href"));
    });
    const data = titleManga.map((d, i) => {
      return {
        titleManga: d,
        thumbs: thumbs[i],
        urlManga: urlsManga[i].includes("https")
          ? urlsManga[i]
          : "https://komiku.org" + urlsManga[i],
      };
    });
    return {
      status: "ok",
      data,
    };
  }
}
