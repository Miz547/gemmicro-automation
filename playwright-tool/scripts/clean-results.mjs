import fs from "fs";
import path from "path";

const resultsDir = path.resolve("allure-results");

fs.rmSync(resultsDir, { recursive: true, force: true });
fs.mkdirSync(resultsDir, { recursive: true });
