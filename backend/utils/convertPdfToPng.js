// filepath: backend/utils/convertPdfToPng.js

import { exec } from "child_process";
import path from "path";
import fs from "fs";

export function convertPdfToPng(pdfPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(pdfPath);
    const base = path.basename(pdfPath, path.extname(pdfPath));
    const output = path.join(dir, base);

    const command = `pdftoppm -png -f 1 -singlefile "${pdfPath}" "${output}"`;

    exec(command, (err) => {
      if (err) return reject(err);

      const pngPath = `${output}.png`;

      if (!fs.existsSync(pngPath)) {
        return reject(new Error("PNG not created"));
      }

      resolve(pngPath);
    });
  });
}