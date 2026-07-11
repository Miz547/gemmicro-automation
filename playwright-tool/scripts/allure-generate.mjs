import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const resultsDir = path.join(rootDir, "allure-results");
const reportsRootDir = path.join(rootDir, "allure-reports");

const now = new Date();
const yyyy = String(now.getFullYear());
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");

const dayDir = path.join(reportsRootDir, yyyy, mm, dd);
fs.mkdirSync(dayDir, { recursive: true });

const existingSeq = fs
  .readdirSync(dayDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d+$/.test(d.name))
  .map((d) => Number(d.name))
  .filter((n) => Number.isFinite(n));

const nextSeq = (existingSeq.length ? Math.max(...existingSeq) : 0) + 1;
const seq = String(nextSeq).padStart(3, "0");
const outputDir = path.join(dayDir, seq);

const reportLabel = `${yyyy}/${mm}/${dd} #${seq}`;
fs.mkdirSync(resultsDir, { recursive: true });
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
  process.exit(generate.status ?? 1);
}

fs.writeFileSync(path.join(rootDir, ".allure-latest"), outputDir, "utf8");
console.log(`Allure report generated: ${outputDir}`);
