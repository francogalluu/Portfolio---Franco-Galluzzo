/**
 * Bakes each gallery frame into a real cropped JPG (Images_camarita/web/)
 * so the site shows exactly what's in the frame below the header.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "Images_camarita");
const OUT_DIR = path.join(SRC_DIR, "web");

const REF_VIEWPORT = 900;
const PHOTO_CHROME = 108;
const STACK_GAP = 18;
const REF_VIEW_H = REF_VIEWPORT - PHOTO_CHROME;

const PHOTO_LAYOUT_GROUPS = [
  { cols: [[{ ar: "0.76" }, { ar: "1.38" }]] },
  { cols: [[{ ar: "0.66" }]] },
  { cols: [[{ ar: "0.76" }, { ar: "1.4" }]] },
  { cols: [[{ ar: "0.74" }]] },
  { cols: [[{ ar: "0.74" }, { ar: "1.16" }], [{ ar: "0.74" }, { ar: "1.16" }]] },
  { cols: [[{ ar: "0.66" }]] },
  { cols: [[{ ar: "0.76" }, { ar: "1.33" }]] },
  { cols: [[{ ar: "0.68" }]] },
  { cols: [[{ ar: "0.74" }, { ar: "1.16" }], [{ ar: "0.74" }, { ar: "1.16" }]] },
  { cols: [[{ ar: "0.74" }]] },
  { cols: [[{ ar: "0.76" }, { ar: "1.38" }]] },
  { cols: [[{ ar: "0.66" }]] },
  { cols: [[{ ar: "0.74" }, { ar: "1.16" }], [{ ar: "0.74" }, { ar: "1.16" }]] },
  { cols: [[{ ar: "0.68" }]] },
  { cols: [[{ ar: "0.76" }, { ar: "1.38" }]] },
  { cols: [[{ ar: "0.74" }]] },
  { cols: [[{ ar: "0.68" }]] },
];

function flattenSlots(groups) {
  const slots = [];
  for (const group of groups) {
    for (const col of group.cols) {
      const colLength = col.length;
      for (const photo of col) {
        slots.push({ ar: Number(photo.ar), colLength });
      }
    }
  }
  return slots;
}

function readPortfolio() {
  const code = fs.readFileSync(path.join(ROOT, "portfolio.jsx"), "utf8");
  const imagesBlock = code.match(/const CAMARITA_IMAGES = \[([\s\S]*?)\];/);
  const editsBlock = code.match(/const PHOTO_EDITS = (\{[\s\S]*?\n\});/);
  if (!imagesBlock || !editsBlock) throw new Error("Could not parse portfolio.jsx");

  const images = [...imagesBlock[1].matchAll(/"Images_camarita\/([^"]+)"/g)].map((m) => m[1]);
  const edits = Function(`return ${editsBlock[1].replace(/;$/, "")}`)();
  const slots = flattenSlots(PHOTO_LAYOUT_GROUPS);

  return { images, edits, slots };
}

function framePx(colLength, ar, frameHPct = 100) {
  let h = colLength === 1
    ? REF_VIEW_H
    : (REF_VIEW_H - STACK_GAP * (colLength - 1)) / colLength;
  h *= frameHPct / 100;
  const w = h * ar;
  return { w: Math.round(w), h: Math.round(h) };
}

function computeCrop(nw, nh, frameW, frameH, edit) {
  const posX = edit.posX ?? 50;
  const posY = edit.posY ?? 50;
  const zoom = edit.zoom ?? 1;
  const scale = Math.max(frameW / nw, frameH / nh) * zoom;
  const sw = nw * scale;
  const sh = nh * scale;
  const maxPanX = Math.max(0, (sw - frameW) / 2);
  const maxPanY = Math.max(0, (sh - frameH) / 2);
  const tx = ((50 - posX) / 50) * maxPanX;
  const ty = ((50 - posY) / 50) * maxPanY;

  let left = (sw / 2 - frameW / 2 - tx) / scale;
  let top = (sh / 2 - frameH / 2 - ty) / scale;
  let width = frameW / scale;
  let height = frameH / scale;

  left = Math.max(0, Math.min(nw - 1, left));
  top = Math.max(0, Math.min(nh - 1, top));
  width = Math.min(nw - left, width);
  height = Math.min(nh - top, height);

  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.max(1, Math.round(width)),
    height: Math.max(1, Math.round(height)),
  };
}

function mergeEdit(slot, edits, src) {
  const key = `Images_camarita/${src}`;
  return {
    posX: 50,
    posY: 50,
    zoom: 1,
    frameH: 100,
    ar: slot.ar,
    ...(edits[key] || {}),
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { images, edits, slots } = readPortfolio();
  const baked = new Set();

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    if (baked.has(file)) continue;
    baked.add(file);

    const slot = slots[i] || slots[slots.length - 1];
    const edit = mergeEdit(slot, edits, file);
    const ar = edit.ar ?? slot.ar;
    const frameH = edit.frameH ?? 100;
    const { w, h } = framePx(slot.colLength, ar, frameH);
    const input = path.join(SRC_DIR, file);
    const output = path.join(OUT_DIR, file);

    if (!fs.existsSync(input)) {
      console.warn(`skip missing: ${file}`);
      continue;
    }

    const meta = await sharp(input).metadata();
    const crop = computeCrop(meta.width, meta.height, w, h, edit);

    await sharp(input)
      .extract(crop)
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(output);

    console.log(`${file} → ${crop.width}x${crop.height} (frame ${w}x${h}, ar ${ar})`);
  }

  console.log(`\nDone — ${baked.size} crops in Images_camarita/web/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
