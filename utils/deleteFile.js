import { unlink } from "fs";
import { join } from "path";

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
