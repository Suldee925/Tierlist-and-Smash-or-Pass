const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 6969;

const PUBLIC_DIR = path.join(__dirname, "public");
const IMAGES_DIR = path.join(__dirname, "images");

function listImages() {
  if (!fs.existsSync(IMAGES_DIR)) return [];
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  return fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => allowed.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

app.use(express.static(PUBLIC_DIR));
app.use("/images", express.static(IMAGES_DIR));

app.get("/api/images", (_req, res) => {
  res.json({ images: listImages() });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Running: http://localhost:${PORT}`);
  console.log(`📁 Put images here: ${IMAGES_DIR}`);
});