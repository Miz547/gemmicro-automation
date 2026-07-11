import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = process.cwd();
const latestFile = path.join(rootDir, ".allure-latest");

if (!fs.existsSync(latestFile)) {
  console.error("No generated report found. Run: npm run allure:generate");
  process.exit(1);
}

const reportDir = fs.readFileSync(latestFile, "utf8").trim();
if (!reportDir || !fs.existsSync(reportDir)) {
  console.error("Latest report path is invalid. Run: npm run allure:generate");
  process.exit(1);
}

const localAllureBin =
  process.platform === "win32"
    ? path.join(rootDir, "node_modules", ".bin", "allure.cmd")
    : path.join(rootDir, "node_modules", ".bin", "allure");
const fallbackBin = process.platform === "win32" ? "npx.cmd" : "npx";

let open = spawnSync(localAllureBin, ["open", reportDir], {
  stdio: "inherit",
  shell: false
});

if (open.error) {
  open = spawnSync(fallbackBin, ["allure", "open", reportDir], {
    stdio: "inherit",
    shell: false
  });
}

process.exit(open.status ?? 1);
