import fs from "fs";
import path from "path";

export default function globalSetup() {
  const resultsDir = path.resolve("allure-results");
  if (fs.existsSync(resultsDir)) {
    fs.rmSync(resultsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(resultsDir);
}
