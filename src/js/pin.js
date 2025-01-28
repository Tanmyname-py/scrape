const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function pinSearch(query) {
/**
 * Function search to web pinterest
 * Scraped By @Tan
 * Protected By MIT LICENSE
 * Source https://github.com/Tanmyname-py
 * You can modify with the condition not to delete this WM
 */
  const url = `https://id.pinterest.com/search/pins/?rs=typed&q=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'Cookie':  'Get your cookies from Pinterest ', //
      },
    });

    const $ = cheerio.load(response.data);
    const jsonData = JSON.parse($('#__PWS_INITIAL_PROPS__').html());

    const pinData = jsonData.initialReduxState.pins;
    const results = [];

    for (const key in pinData) {
      if (pinData.hasOwnProperty(key)) {
        const pin = pinData[key];
        const id = `https://id.pinterest.com/pin/${pin.id}/`;
        const title = pin.grid_title || pin.title || 'No Title';
        const imageUrl = pin.images?.orig?.url || 'No Image URL';
        results.push({ id, title, imageUrl });
      }
    }

    return results.length > 0 ? results : { message: 'Eror data not found ' };
  } catch (error) {
    console.error('Error:', error.message);
    return { error: error.message };
  }
}

async function pinGet(pinterestUrl) {
/**
 * Function download vid,gif,image from pinterest 
 * Scraped By @Tan
 * Protected By MIT LICENSE
 * Source https://github.com/Tanmyname-py
 * You can modify with the condition not to delete this WM
 */
    try {
        const savePinUrl = `https://www.savepin.app/download.php?url=${encodeURIComponent(pinterestUrl)}&lang=en&type=redirect`;
        const response = await axios.get(savePinUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            }
        });
        const $ = cheerio.load(response.data);
        const thumbnail = $('.image-container img').attr('src');
        const title = $('.table-container h1').text().trim();
        const videoUrl = $('.table-container table tbody tr')
            .filter((_, el) => $(el).find('.video-quality').text().trim() === '1080p')
            .find('a.button')
            .attr('href');
        return {
            title,
            thumbnail,
            videoUrl
        };
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

