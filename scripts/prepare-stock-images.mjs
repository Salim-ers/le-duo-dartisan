// Télécharge et convertit les photographies d'ambiance libres de droit (licence CC0).
// Source : WordPress Photo Directory — https://wordpress.org/photos/license/
// Les crédits affichés sur le site se trouvent dans data/images.ts.
// Usage : node scripts/prepare-stock-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/images/ambiance");

const photos = {
  // Chuck Grimmett — https://wordpress.org/photos/photo/27461ffbf8/
  "champ-de-ble": "https://pd.w.org/2022/02/27461ffbf8bf09371.79490738-2048x1365.jpg",
  // Jennifer Bourn — https://wordpress.org/photos/photo/343637b078/
  "epis-de-ble": "https://pd.w.org/2022/11/343637b078417ba62.06962805-2048x1152.jpg",
  // Tawhid Sadman — https://wordpress.org/photos/photo/99169d2662/
  "patons-farine": "https://pd.w.org/2026/04/99169d2662a3d2939.06244534-2048x1536.jpg",
  // Reyes Martínez — https://wordpress.org/photos/photo/210622cf27/
  croissants: "https://pd.w.org/2022/03/210622cf2763dc374.65124722-2048x1365.jpg",
};

await mkdir(OUT, { recursive: true });
for (const [name, url] of Object.entries(photos)) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name} : HTTP ${res.status}`);
  const info = await sharp(Buffer.from(await res.arrayBuffer()))
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(OUT, `${name}.webp`));
  console.log(name, info.width, "x", info.height, Math.round(info.size / 1024) + "ko");
}
