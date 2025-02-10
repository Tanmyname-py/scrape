const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

async function Tohd(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const command = `
            ffmpeg -i "${inputPath}" -vf "scale=-2:1080,eq=brightness=0.06:contrast=1.4:saturation=1.5" -c:v libx264 -preset slow -crf 18 -c:a copy "${outputPath}"
        `;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`❌ Gagal meningkatkan kualitas video: ${error.message}`);
                return;
            }
            resolve(`✅ Video telah ditingkatkan dan disimpan di: ${outputPath}`);
        });
    });
}

module.exports = { Tohd }
