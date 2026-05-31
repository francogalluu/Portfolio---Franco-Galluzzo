import { readFileSync, writeFileSync } from "fs";

function decodeHtml(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const htmlPath =
  "c:\\Users\\franc\\OneDrive\\Escritorio\\Franco Galluzzo _ LinkedIn.html";
const outPath = new URL("../certifications.json", import.meta.url);

const text = readFileSync(htmlPath, "utf8");

const names = [];
const re = /aria-label="Editar licencia o certificaci[oó]n ([^"]+)"/g;
let m;
while ((m = re.exec(text)) !== null) {
  names.push(decodeHtml(m[1]));
}

const seen = new Set();
const unique = [];
for (const n of names) {
  if (!seen.has(n)) {
    seen.add(n);
    unique.push(n);
  }
}

function inferCategory(degree) {
  const d = degree.toLowerCase();
  if (
    d.includes("ux") || d.includes("ui ") || d.includes("(ui)") ||
    d.includes("figma") || d.includes("wireframe") || d.includes("visual design") ||
    d.includes("augmented reality") || d.includes("mobile ui") ||
    d.includes("diseño de interfaz") || d.includes("experiencia de usuario") ||
    d.includes("user experience") || d.includes("data-driven design")
  ) {
    return "ux";
  }
  if (
    d.includes("python") || d.includes("web development") ||
    d.includes("coding foundations") || d.includes("html and css")
  ) {
    return "code";
  }
  if (
    d.includes("sql") || d.includes("data") || d.includes("power bi") ||
    d.includes("pl-300") || d.includes("analytics") || d.includes("r programming") ||
    d.includes("business intelligence") || d.includes("data engineering") ||
    d.includes("generative ai") || d.includes("google ai") ||
    d.includes("visualization")
  ) {
    return "data";
  }
  return null;
}

function inferSchool(degree) {
  const d = degree.toLowerCase();
  if (
    d.includes("pl-300") ||
    d.includes("power bi") ||
    d.includes("business intelligence") && d.includes("foundations")
  ) {
    return "Microsoft";
  }
  if (d.startsWith("google ") || d.includes("foundations: data") || d.includes("ask questions to make data")) {
    return "Google";
  }
  if (d.includes("generative ai with large language")) return "DeepLearning.AI";
  if (d.includes("html and css in depth")) return "Meta";
  if (d.includes("english course")) return "EF Education First";
  if (
    d.includes("sql") ||
    d.includes("python") ||
    d.includes("web development") ||
    d.includes("coding foundations") ||
    d.includes("data engineering") ||
    d.includes("joining data")
  ) {
    return "DataCamp";
  }
  if (
    d.includes("ux") ||
    d.includes("ui") ||
    d.includes("figma") ||
    d.includes("wireframe") ||
    d.includes("visual design") ||
    d.includes("augmented reality") ||
    d.includes("mobile ui") ||
    d.includes("data-driven design") ||
    d.includes("diseño") ||
    d.includes("experiencia de usuario") ||
    d.includes("liderazgo") ||
    d.includes("membership")
  ) {
    if (d.includes("google ux") || d.includes("foundations of user experience")) return "Google";
    if (d.includes("coursera") || d.includes("build dynamic")) return "Coursera";
    return "Coursera";
  }
  return "Coursera";
}

const featured = new Set([
  "Power BI Data Analyst Associate (PL-300)",
  "Google UX Design Specialization",
  "Google Data Analytics Specialization",
  "Google AI Essentials",
  "Generative AI with Large Language Models",
  "HTML and CSS in depth",
]);

const SCHOOL_LOGOS = {
  Microsoft: "assets/about me/microsoft_logo_icon_181372.png",
  Google: "assets/about me/Google.png",
  Coursera: "assets/about me/coursera logo.webp",
  DataCamp: "assets/about me/datacamp logo.png",
  Meta: "assets/about me/meta logo.webp",
};

const certs = unique.map((degree) => {
  const school = inferSchool(degree);
  const entry = {
    degree,
    school,
    category: inferCategory(degree),
    issued: "",
    featured: featured.has(degree),
  };
  if (SCHOOL_LOGOS[school]) entry.logo = SCHOOL_LOGOS[school];
  return entry;
});

writeFileSync(outPath, JSON.stringify(certs, null, 2) + "\n", "utf8");
console.log(`Wrote ${certs.length} certifications to ${outPath.pathname}`);
