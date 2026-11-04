// Télécharge et convertit les photographies libres de droit (licence Unsplash :
// usage commercial autorisé, attribution non requise — https://unsplash.com/license).
// Les crédits affichés sur le site se trouvent dans data/images.ts.
// Usage : node scripts/prepare-stock-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/images/ambiance");
const WIDTH = 2600;

/** Fichier de sortie → identifiant de la photo sur Unsplash. */
const photos = {
  "farine-sur-pain": "I5G_suhoqBQ",
  "baguette-fond-noir": "dY8F7ZlZvYU",
  "croissants-fond-noir": "m9pzwmxm2rk",
  "tartelette-framboises": "83sgp9jxW8k",
  "sandwich-baguette": "eQqY_KQOqEE",
  "champ-de-ble-couchant": "y6dUxc66kAs",
  "gateau-fruits-rouges": "_B7shfNUXEA",
  "gateau-fleurs-blanches": "HBETvpRcRgA",
  "bol-de-farine": "quVArOn8-30",
  "petrissage-mains": "5CRzqqWzEKQ",
  "pains-de-seigle": "QnQSxrXFgnw",
  "pate-farine-fond-noir": "m9qWesqRN0M",
  "dressage-fraises": "xNV90NpObDQ",
};

await mkdir(OUT, { recursive: true });
for (const [name, id] of Object.entries(photos)) {
  const res = await fetch(`https://unsplash.com/photos/${id}/download?w=${WIDTH}`, {
    headers: { "User-Agent": "le-duo-dartisans-image-script" },
  });
  if (!res.ok) throw new Error(`${name} : HTTP ${res.status}`);
  const info = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(path.join(OUT, `${name}.webp`));
  console.log(name, info.width, "x", info.height, Math.round(info.size / 1024) + "ko");
}
