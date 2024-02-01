import { unlink } from "fs";
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    // fs.unlink method to delete the file
    unlink(join(__dirname, "..", "uploads", filePath), (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        reject(err);
      } else {
        console.log("File deleted successfully");
        resolve();
      }
    });
  });
};

export default deleteFile;
