// imagesToPdf.js
// npm install axios pdfkit jpeg-js pngjs

import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";
import jpegjs from "jpeg-js";
import { PNG } from "pngjs";

// ─── Config ───────────────────────────────────────────────────────────────────
const CONCURRENCY    = 3;
const RETRY_MAX      = 3;
const RETRY_DELAY_MS = 1000;

// ─── Helper ───────────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function sanitizeFilename(name) {
  return name.replace(/[<>:"/\\|?*]/g, "").trim();
}

function getExtFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    const ext = pathname.split(".").pop().toLowerCase().split("?")[0];
    return ext || "jpg";
  } catch {
    return "jpg";
  }
}

// ─── Deteksi format dari magic bytes ─────────────────────────────────────────
function detectFormat(buffer) {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return "png";
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "jpg";
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return "gif";
  if (buffer[0] === 0x52 && buffer[1] === 0x49 &&
      buffer[8] === 0x57 && buffer[9] === 0x45) return "webp";
  if (buffer[0] === 0x42 && buffer[1] === 0x4d) return "bmp";
  return "unknown";
}

// ─── Encode RGBA → PNG buffer ─────────────────────────────────────────────────
function rgbaToPngBuffer(width, height, data) {
  const png  = new PNG({ width, height });
  png.data   = Buffer.from(data);
  return PNG.sync.write(png);
}

// ─── WEBP → PNG via @saschazar/wasm-webp (pure WASM) ─────────────────────────
async function webpToPng(buffer) {
  try {
    const { default: webp } = await import("@saschazar/wasm-webp");
    const instance = await webp();
    const uint8    = new Uint8Array(buffer);
    const decoded  = instance.decode(uint8, uint8.length);
    return rgbaToPngBuffer(decoded.width, decoded.height, decoded.data);
  } catch {
    throw new Error("WEBP gagal. Install: npm install @saschazar/wasm-webp");
  }
}

// ─── BMP → PNG (pure JS, no deps) ────────────────────────────────────────────
function bmpToPng(buffer) {
  const dataOffset = buffer.readUInt32LE(10);
  const width      = buffer.readInt32LE(18);
  const height     = Math.abs(buffer.readInt32LE(22));
  const bitsPerPx  = buffer.readUInt16LE(28);
  const topDown    = buffer.readInt32LE(22) < 0;

  if (bitsPerPx !== 24 && bitsPerPx !== 32) {
    throw new Error(`BMP ${bitsPerPx}-bit tidak didukung (hanya 24/32-bit)`);
  }

  const bytesPerPx = bitsPerPx / 8;
  const rowSize    = Math.floor((bitsPerPx * width + 31) / 32) * 4;
  const rgba       = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    const srcY   = topDown ? y : height - 1 - y;
    const rowOff = dataOffset + srcY * rowSize;
    for (let x = 0; x < width; x++) {
      const src     = rowOff + x * bytesPerPx;
      const dst     = (y * width + x) * 4;
      rgba[dst]     = buffer[src + 2];
      rgba[dst + 1] = buffer[src + 1];
      rgba[dst + 2] = buffer[src];
      rgba[dst + 3] = bytesPerPx === 4 ? buffer[src + 3] : 255;
    }
  }

  return rgbaToPngBuffer(width, height, rgba);
}

// ─── GIF → PNG via omggif (frame pertama) ────────────────────────────────────
async function gifToPng(buffer) {
  try {
    const { default: GifReader } = await import("omggif");
    const reader      = new GifReader(new Uint8Array(buffer));
    const { width, height } = reader;
    const rgba        = new Uint8Array(width * height * 4);
    reader.decodeAndBlitFrameRGBA(0, rgba);
    return rgbaToPngBuffer(width, height, rgba);
  } catch {
    throw new Error("GIF gagal. Install: npm install omggif");
  }
}

// ─── Normalisasi semua format → jpg/png yang diterima pdfkit ─────────────────
async function normalizeImageBuffer(buffer, extHint) {
  const fmt = detectFormat(buffer) !== "unknown" ? detectFormat(buffer) : extHint;

  switch (fmt) {
    case "jpg":
    case "jpeg":
      jpegjs.decode(buffer, { useTArray: true }); // validasi
      return buffer;

    case "png":
      PNG.sync.read(buffer); // validasi
      return buffer;

    case "webp":
      console.log(`    🔄 Konversi WEBP → PNG`);
      return await webpToPng(buffer);

    case "bmp":
      console.log(`    🔄 Konversi BMP → PNG`);
      return bmpToPng(buffer);

    case "gif":
      console.log(`    🔄 Konversi GIF → PNG (frame 1)`);
      return await gifToPng(buffer);

    default:
      try {
        jpegjs.decode(buffer, { useTArray: true });
        return buffer;
      } catch {
        throw new Error(`Format '${fmt}' tidak didukung`);
      }
  }
}

// ─── Download dengan retry ────────────────────────────────────────────────────
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

// ─── Concurrency pool ─────────────────────────────────────────────────────────
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

// ─── Build PDF ────────────────────────────────────────────────────────────────
async function buildPdf(outputPath, imageBuffers) {
  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ autoFirstPage: false, margin: 0 });
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

// ─── Main Function ────────────────────────────────────────────────────────────
export async function imagesToPdf(apiResponse) {
  if (apiResponse.status !== "ok") {
    throw new Error(`Status tidak valid: ${apiResponse.status}`);
  }

  const { titleManga, images } = apiResponse.data;
  const outputFile = `${sanitizeFilename(titleManga)}.pdf`;

  console.log(`📖 Judul  : ${titleManga}`);
  console.log(`📄 Output : ${outputFile}`);
  console.log(`🖼  Total  : ${images.length} halaman\n`);

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

  console.log(`\n📦 Membuat PDF...`);
  await buildPdf(outputFile, imageBuffers);

  const size = fs.statSync(outputFile).size;
  console.log(`\n✅ Selesai! → ${outputFile} (${(size / 1024 / 1024).toFixed(2)} MB)`);
  return outputFile;
}

// ─── Entry point ──────────────────────────────────────────────────────────────
const response = {
  status: "ok",
  data: {
    titleManga: "Bleach Chapter 686",
    images: [
      { page: "1",  url: "https://img.komiku.org/wp-content/uploads/2271541-1.jpg",  titlePage: "Komik Bleach Chapter 686 gambar 1"  },
      { page: "2",  url: "https://img.komiku.org/wp-content/uploads/2271541-2.jpg",  titlePage: "Manga Bleach Chapter 686 gambar 2"  },
      { page: "3",  url: "https://img.komiku.org/wp-content/uploads/2271541-3.jpg",  titlePage: "Bleach Chapter 686 Gambar 3"  },
      { page: "4",  url: "https://img.komiku.org/wp-content/uploads/2271541-4.jpg",  titlePage: "Bleach Chapter 686 Gambar 4"  },
      { page: "5",  url: "https://img.komiku.org/wp-content/uploads/2271541-5.jpg",  titlePage: "Bleach Chapter 686 Gambar 5"  },
      { page: "6",  url: "https://img.komiku.org/wp-content/uploads/2271541-6.jpg",  titlePage: "Bleach Chapter 686 Gambar 6"  },
      { page: "7",  url: "https://img.komiku.org/wp-content/uploads/2271541-7.jpg",  titlePage: "Bleach Chapter 686 Gambar 7"  },
      { page: "8",  url: "https://img.komiku.org/wp-content/uploads/2271541-8.jpg",  titlePage: "Bleach Chapter 686 Gambar 8"  },
      { page: "9",  url: "https://img.komiku.org/wp-content/uploads/2271541-9.jpg",  titlePage: "Bleach Chapter 686 Gambar 9"  },
      { page: "10", url: "https://img.komiku.org/wp-content/uploads/2271541-10.jpg", titlePage: "Bleach Chapter 686 Gambar 10" },
      { page: "11", url: "https://img.komiku.org/wp-content/uploads/2271541-11.jpg", titlePage: "Bleach Chapter 686 Gambar 11" },
      { page: "12", url: "https://img.komiku.org/wp-content/uploads/2271541-12.jpg", titlePage: "Bleach Chapter 686 Gambar 12" },
      { page: "13", url: "https://img.komiku.org/wp-content/uploads/2271541-13.jpg", titlePage: "Bleach Chapter 686 Gambar 13" },
      { page: "14", url: "https://img.komiku.org/wp-content/uploads/2271541-14.jpg", titlePage: "Bleach Chapter 686 Gambar 14" },
      { page: "15", url: "https://img.komiku.org/wp-content/uploads/2271541-15.jpg", titlePage: "Bleach Chapter 686 Gambar 15" },
      { page: "16", url: "https://img.komiku.org/wp-content/uploads/2271541-16.jpg", titlePage: "Bleach Chapter 686 Gambar 16" },
      { page: "17", url: "https://img.komiku.org/wp-content/uploads/2271541-17.jpg", titlePage: "Bleach Chapter 686 Gambar 17" },
      { page: "18", url: "https://img.komiku.org/wp-content/uploads/2271541-18.jpg", titlePage: "Bleach Chapter 686 Gambar 18" },
      { page: "19", url: "https://img.komiku.org/wp-content/uploads/2271541-19.jpg", titlePage: "Bleach Chapter 686 Gambar 19" },
      { page: "20", url: "https://img.komiku.org/wp-content/uploads/2271541-20.jpg", titlePage: "Bleach Chapter 686 Gambar 20" },
      { page: "21", url: "https://img.komiku.org/wp-content/uploads/2271541-21.jpg", titlePage: "Bleach Chapter 686 Gambar 21" },
      { page: "22", url: "https://img.komiku.org/wp-content/uploads/2271541-22.jpg", titlePage: "Bleach Chapter 686 Gambar 22" },
      { page: "23", url: "https://img.komiku.org/wp-content/uploads/2271541-23.jpg", titlePage: "Bleach Chapter 686 Gambar 23" },
      { page: "24", url: "https://img.komiku.org/wp-content/uploads/2271541-24.jpg", titlePage: "Bleach Chapter 686 Gambar 24" },
      { page: "25", url: "https://img.komiku.org/wp-content/uploads/2271541-25.jpg", titlePage: "Bleach Chapter 686 Gambar 25" },
      { page: "26", url: "https://img.komiku.org/wp-content/uploads/2271541-26.jpg", titlePage: "Bleach Chapter 686 Gambar 26" },
      { page: "27", url: "https://img.komiku.org/wp-content/uploads/2271541-27.png", titlePage: "Bleach Chapter 686 Gambar 27" },
    ],
  },
};

imagesToPdf(response).catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
