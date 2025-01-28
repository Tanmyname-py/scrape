const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
/**
 * Scraped By @Tan
 * Protected By MIT LICENSE
 * Source https://github.com/Tanmyname-py
 * You can modify with the condition not to delete this WM
 */

async function pinSearch(query) {
  const url = `https://id.pinterest.com/search/pins/?rs=typed&q=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'Cookie':  '_auth=1; _b="AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg="; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5 RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=', // Tambahkan cookie jika diperlukan
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

    return results.length > 0 ? results : { message: 'Tidak ditemukan hasil untuk kueri yang diberikan.' };
  } catch (error) {
    console.error('Error:', error.message);
    return { error: error.message };
  }
}

async function pinGet(pinterestUrl) {
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

function convertGifToVideo(gifPath, videoPath) {
  return new Promise((resolve, reject) => {
    console.log(`Converting file: ${gifPath} to: ${videoPath}`);

    ffmpeg(gifPath)
      .on('start', commandLine => {
        console.log('FFmpeg command line: ', commandLine); 
      })
      .on('error', (err, stdout, stderr) => {
        console.error('Error during conversion:', err);
        console.error('FFmpeg stderr:', stderr); 
        reject(err);
      })
      .on('end', () => {
        console.log(`Conversion completed: ${gifPath} to ${videoPath}`);
        resolve(videoPath);
      })
      .output(videoPath)
      .outputOptions([
        '-movflags faststart', 
        '-pix_fmt yuv420p',  
        '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2'
      ])
      .run();
  });
}

