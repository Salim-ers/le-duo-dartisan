// Prépare les photographies fournies : conversion WebP haute qualité,
// recadrages de détails de vitrine et vectorisation du logo.
// Usage : SOURCE_DIR=/chemin/vers/photos node scripts/prepare-images.mjs
import sharp from "sharp";
import potrace from "potrace";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = process.env.SOURCE_DIR ?? "./assets-source";
const OUT = path.resolve("public/images");
const P = "ChatGPT_Image_10_sept__2026_";

const photos = {
  "maison/facade": "21_35_15_1",
  "pains/baguettes-alignees": "21_35_16_3",
  "pains/baguettes-croisees": "21_36_14_7",
  "gateaux/fraisier-fruits": "21_35_16_4",
  "gateaux/number-cake": "21_35_17_6",
  "viennoiseries/pains-au-chocolat": "21_35_16_5",
  "gourmandises/cookies-garnis": "21_35_17_7",
  "gourmandises/macarons-framboise": "21_35_18_9",
  "snacking/salades": "21_35_17_8",
  "snacking/sandwichs": "21_35_18_10",
  "patisseries/flans-individuels": "21_36_12_1",
  "patisseries/entremets-fruits": "21_36_13_6",
  "fabrication/petrissage": "21_36_13_4",
  "vitrine/vitrine-flans-macarons": "21_41_05_1",
  "vitrine/vitrine-tartes": "21_41_05_2",
  "vitrine/vitrine-eclairs": "21_41_05_3",
  "vitrine/vitrine-patisseries": "21_41_06_4",
};

// Détails recadrés dans les vitrines (source, [x, y, w, h])
const crops = {
  "gateaux/fraisier-detail": ["21_35_16_4", [250, 300, 640, 800]],
  "gateaux/assortiment-detail": ["21_41_05_3", [150, 300, 416, 520]],
  "details/religieuses": ["21_41_05_1", [1090, 450, 210, 300]],
  "details/eclairs-chocolat": ["21_41_05_1", [1520, 520, 152, 300]],
  "details/tartelettes-meringuees": ["21_41_05_1", [620, 420, 280, 210]],
  "details/entremets-citron": ["21_41_05_1", [1340, 500, 210, 300]],
  "details/flan-coco": ["21_41_05_1", [1130, 165, 280, 200]],
  "details/eclairs-pistache": ["21_41_05_3", [0, 440, 300, 400]],
  "details/tartelettes-fruits-rouges": ["21_41_05_3", [180, 420, 240, 300]],
};

async function run() {
  for (const [name, id] of Object.entries(photos)) {
    const out = path.join(OUT, `${name}.webp`);
    await mkdir(path.dirname(out), { recursive: true });
    const info = await sharp(path.join(SRC, `${P}${id}.png`))
      .webp({ quality: 90, effort: 6 })
      .toFile(out);
    console.log(name, info.width, "x", info.height, Math.round(info.size / 1024) + "ko");
  }
  for (const [name, [id, [left, top, width, height]]] of Object.entries(crops)) {
    const out = path.join(OUT, `${name}.webp`);
    await mkdir(path.dirname(out), { recursive: true });
    await sharp(path.join(SRC, `${P}${id}.png`))
      .extract({ left, top, width, height })
      .webp({ quality: 92 })
      .toFile(out);
    console.log(name, width, "x", height);
  }

  // Image Open Graph 1200x630 depuis la façade
  await sharp(path.join(SRC, `${P}21_35_15_1.png`))
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .jpeg({ quality: 86 })
    .toFile(path.resolve("app/opengraph-image.jpg"));

  // Logo : isolation du lettrage blanc puis vectorisation
  const logoSrc = path.join(SRC, "Le_duo_d_artisans_en_écriture_élégante.png");
  const { data, info } = await sharp(logoSrc).raw().toBuffer({ resolveWithObject: true });
  const bw = Buffer.alloc(info.width * info.height);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * info.channels];
    const g = data[i * info.channels + 1];
    // le lettrage est blanc (R élevé), le fond et l'ombre sont bleus (R faible)
    bw[i] = r > 150 && g > 180 ? 0 : 255;
  }
  const bwPng = await sharp(bw, { raw: { width: info.width, height: info.height, channels: 1 } })
    .png()
    .toBuffer();
  const svgPath = await new Promise((resolve, reject) =>
    potrace.trace(bwPng, { threshold: 128, turdSize: 20, optTolerance: 0.3 }, (err, svg) =>
      err ? reject(err) : resolve(svg),
    ),
  );
  await writeFile(path.resolve("scripts/logo-traced.svg"), svgPath);
  console.log("logo traced");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
