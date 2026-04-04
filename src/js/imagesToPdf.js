// imagesToPdf.js
// npm install axios pdfkit sharp
// Helper Manga.js untuk download manga ke pdf
import axios from "axios";
import PDFDocument from "pdfkit";
import sharp from "sharp";
import fs from "fs";

// ─── Config ────
const CONCURRENCY    = 3;
const RETRY_MAX      = 3;
const RETRY_DELAY_MS = 1000;

// Format yang didukung pdfkit secara native
const PDFKIT_NATIVE  = new Set(["jpeg", "jpg", "png"]);

// ─── Helper ────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, "").trim();
}

// Deteksi ekstensi dari URL (fallback ke "jpg")
function getExtFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const ext = pathname.split(".").pop().toLowerCase().split("?")[0];
    return ext || "jpg";
  } catch {
    return "jpg";
  }
}

// ─── Konversi buffer ke PNG jika format tidak didukung pdfkit ─────
async function normalizeImageBuffer(buffer, ext) {
  if (PDFKIT_NATIVE.has(ext)) return buffer; // Tidak perlu konversi

  console.log(`    🔄 Konversi .${ext} → PNG via sharp`);
  return await sharp(buffer).png().toBuffer();
}

// ─── Download dengan retry ────
async function downloadImage(url, attempt = 1) {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    return Buffer.from(res.data);
  } catch (err) {
    if (attempt < RETRY_MAX) {
      console.warn(`  ⚠ Retry ${attempt}/${RETRY_MAX} → ${url}`);
      await delay(RETRY_DELAY_MS * attempt);
      return downloadImage(url, attempt + 1);
    }
    throw new Error(`Gagal download: ${url} — ${err.message}`);
  }
}

// ─── Concurrency pool ───
async function processWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ─── Build PDF ────
async function buildPdf(outputPath, imageBuffers) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ autoFirstPage: false, margin: 0 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);
    stream.on("finish", resolve);
    stream.on("error", reject);

    for (const { page, buffer } of imageBuffers) {
      const img = doc.openImage(buffer);
      doc.addPage({ size: [img.width, img.height], margin: 0 });
      doc.image(buffer, 0, 0, { width: img.width, height: img.height });
      console.log(`  ✓ Halaman ${page} (${img.width}×${img.height}px)`);
    }

    doc.end();
  });
}

// ─── Main Function ───
export async function imagesToPdf(apiResponse) {
  if (apiResponse.status !== "ok") {
    throw new Error(`Status tidak valid: ${apiResponse.status}`);
  }

  const { titleManga, images } = apiResponse.data;
  const outputFile = `${sanitizeFilename(titleManga)}.pdf`;

  console.log(`📖 Judul  : ${titleManga}`);
  console.log(`📄 Output : ${outputFile}`);
  console.log(`🖼  Total  : ${images.length} halaman\n`);

  // 1. Download + normalisasi semua gambar
  console.log(`📥 Mendownload gambar (concurrency: ${CONCURRENCY})...`);
  const imageBuffers = await processWithConcurrency(
    images,
    CONCURRENCY,
    async (item, i) => {
      const ext = getExtFromUrl(item.url);
      process.stdout.write(
        `  [${String(i + 1).padStart(2, "0")}/${images.length}] Page ${item.page} (.${ext})...`
      );

      const raw    = await downloadImage(item.url);
      const buffer = await normalizeImageBuffer(raw, ext);

      console.log(` ✓ ${(buffer.length / 1024).toFixed(1)} KB`);
      return { page: item.page, buffer };
    }
  );

  // 2. Buat PDF
  console.log(`\n📦 Membuat PDF...`);
  await buildPdf(outputFile, imageBuffers);

  const size = fs.statSync(outputFile).size;
  console.log(`\n✅ Selesai! → ${outputFile} (${(size / 1024 / 1024).toFixed(2)} MB)`);

  return outputFile;
}
