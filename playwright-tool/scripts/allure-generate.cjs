const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const rootDir = process.cwd();
const resultsDir = path.join(rootDir, "allure-results");
const reportsRootDir = path.join(rootDir, "allure-reports");
const pad2 = (v) => (v < 10 ? `0${v}` : String(v));
const pad3 = (v) => (v < 10 ? `00${v}` : v < 100 ? `0${v}` : String(v));
const ensureDir = (dirPath) => {
  if (fs.existsSync(dirPath)) return;
  const parent = path.dirname(dirPath);
  if (parent && parent !== dirPath) ensureDir(parent);
  try {
    fs.mkdirSync(dirPath);
  } catch (error) {
    if (!fs.existsSync(dirPath)) throw error;
  }
};

const now = new Date();
const yyyy = String(now.getFullYear());
const mm = pad2(now.getMonth() + 1);
const dd = pad2(now.getDate());
const yyyymmdd = `${yyyy}${mm}${dd}`;

const dayDir = path.join(reportsRootDir, yyyymmdd);
ensureDir(dayDir);

const existingSeq = fs
  .readdirSync(dayDir)
  .filter((name) => /^\d+$/.test(name))
  .filter((name) => {
    try {
      return fs.statSync(path.join(dayDir, name)).isDirectory();
    } catch (_) {
      return false;
    }
  })
  .map((name) => Number(name))
  .filter((n) => Number.isFinite(n));

const nextSeq = (existingSeq.length ? Math.max.apply(null, existingSeq) : 0) + 1;
const seq = pad3(nextSeq);
const outputDir = path.join(dayDir, seq);

const reportLabel = `${yyyy}/${mm}/${dd} #${seq}`;
ensureDir(resultsDir);
fs.writeFileSync(
  path.join(resultsDir, "executor.json"),
  JSON.stringify(
    {
      name: "Gemmicro Tech Auto",
      type: "local",
      buildName: reportLabel,
      buildOrder: nextSeq,
      reportName: `Allure Report ${reportLabel}`
    },
    null,
    2
  ),
  "utf8"
);

const localAllureBin =
  process.platform === "win32"
    ? path.join(rootDir, "node_modules", ".bin", "allure.cmd")
    : path.join(rootDir, "node_modules", ".bin", "allure");
const fallbackBin = process.platform === "win32" ? "npx.cmd" : "npx";

let generate = spawnSync(
  localAllureBin,
  ["generate", resultsDir, "--clean", "-o", outputDir],
  { stdio: "inherit", shell: false }
);

if (generate.error) {
  generate = spawnSync(
    fallbackBin,
    ["allure", "generate", resultsDir, "--clean", "-o", outputDir],
    { stdio: "inherit", shell: false }
  );
}

if (generate.status !== 0) {
  process.exit(generate.status || 1);
}

fs.writeFileSync(path.join(rootDir, ".allure-latest"), outputDir, "utf8");
console.log(`Allure report generated: ${outputDir}`);
