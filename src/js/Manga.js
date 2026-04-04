import axios from "axios";
import * as cheerio from "cheerio";
const { load } = cheerio;
import { decompress } from "@mongodb-js/zstd";

async function SearchManga(title) {
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

async function getChapter(url) {
  try {
  const req = await axios({
    url,
    headers : {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
    }
  })
  if (req.status === 200) {
    const $ = load(req.data);
    const info = [];
    const chManga = [];
    $(".inftable > tbody tr").each((_,el) => {
      //console.log($(el).html())
     let [key,value] = $(el).find("td").text().split(":");
    value = key === "Genre" ? value.split("\n").filter(d => d !== "") : value;
     info.push({[key] : value});
    });
    $("#Daftar_Chapter > tbody tr").each((_,el) => {
      let url = $(el).find("td a").attr("href");
    
      let ch = $(el).find("td a span").text();
      if(ch) {
        ch = ch.match(/\d+/g);
        chManga.push({ [ch] : "https://komiku.org" + url })
      }
    });  
    return {
      status: "ok", 
      data : {
      info,
      chManga
      }
    }
         
  }
  } catch (err) {
    return {
      status : "error",
      message : err.message
    }
  }
}

async function getManga(ch) {
 try {
   const req = await axios({
     url : ch,
     headers : {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
    }
   });
   
   if(req.status === 200) {
     const $ = load(req.data);
     const title = $("#Judul h1").text();
     console.log(title);
     const images = [];
      $('#Baca_Komik img.ww').each((i, el) => {
      images.push({
       page: $(el).attr('id'),
       url: $(el).attr('src'),
       titlePage: $(el).attr('alt'),
      });
    });   
  return  {
    status : "ok",
    data : { titleManga: title ,images } 
  }
}
 } catch (err) {
  return { status : "error", message : err.message }
 }
}
