const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
/**
 * scrape create by @Tan
 * https://github.com/Tanmyname-py
 * Fungsi to url from  web top4top.
 * @param {string} filePath.
 * @returns {Promise<string[]>} - Array.
 */
async function uploadToTop4Top(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('File tidak ditemukan.');
        }
        const form = new FormData();
        form.append('submitr', '[ رفع الملفات ]');
        form.append('file_0_', fs.createReadStream(filePath));
        const headers = {
            ...form.getHeaders(),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': '*/*',
            'Connection': 'keep-alive',
        };
        const response = await axios.post('https://top4top.io/index.php', form, {
            headers,
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });
        const urls = [];
        const urlRegex = /https:\/\/[a-zA-Z0-9]+\.top4top\.io\/[^\s"]+/g;
        let match;
        while ((match = urlRegex.exec(response.data)) !== null) {
            urls.push(match[0]);
        }
        if (urls.length === 0) {
            throw new Error('Tidak ada URL yang ditemukan dalam respons.');
        }
        return urls.slice(0, 3);
    } catch (error) {
        console.error('Error saat mengupload ke Top4Top:', error.message);
        throw error;
    }
}
module.exports = {
 uploadToTop4Top
};
