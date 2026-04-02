import axios from "axios";
import {decompress} from "@mongodb-js/zstd";
import * as cheerio from "cheerio";
const {load} = cheerio;
async function animeSearch(title) {
    const res = await axios({
        url: `https://v1.animasu.app/?s=${title}`,
        method: "GET",
        headers : {
            "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding" : "gzip, deflate, br, zstd",
            "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
        },
        responseType: "arraybuffer",
        decompress: false
    }).catch((err) => {
        console.log(err)
    });

    if(res.status === 200) {
        const dec = await decompress(res.data);
        const titles = [];
        const urls = [];
        const thumbs = [];
        const $ = load(dec.toString('utf-8'));
        $(".bs").each((_,el) => {
            titles.push($(el).find(".tt").text().trim());
            urls.push($(el).find("a").attr("href"));
            thumbs.push($(el).find('img').attr("src"));
        });
        return titles.map((title,i) => {
            return {
                title,
                url : urls[i],
                thumb : thumbs[i]
            }
        });
    } 
}

async function getUrlEps(urlAnime) {
    const req = await axios({
        url : urlAnime,
        headers : {
            "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
        }
    }).catch(err => console.log(err));
    if(req.status === 200) {
        const {data} = req;
        const $ = load(data);
        const urlEps = [];
        const titleEps = [];
        $("#daftarepisode > li").each((_,el) => {
            urlEps.push($(el).find("a").attr("href"));
            titleEps.push($(el).find("a").text().match(/\d+/g)[0]);
        });

        if(urlEps.length > 0) {
            return titleEps.map((eps,i) => {
                return {
                    [eps] : urlEps[i]
                };
            });
        };
    };
};

async function getStreamAnime(urlEps) {
    const req = await axios({
        url: urlEps,
        headers : {
            "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
        }
    }).catch(err => console.log(err));
    if(req.status === 200) {
        const {data} = req;
        const $ = load(data);
        const urlStream = $("iframe").attr("src");
        const streamOption = [];
        const defaultQuality =  urlStream.includes("https:") ? urlStream : "https:" + urlStream;
        $(".mirror > option").each((i,el) => {
            if(i > 0) { 
            streamOption.push({
                [$(el).text().trim()] : Buffer.from($(el).attr("value"),"base64").toString("utf-8")
            });
            };
        });

        return {
            stream : {
                defaultQuality,
                streamOption
            }
        };
    };
};




