const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    // fs.unlink method to delete the file
    fs.unlink(path.join(__dirname, "..", "uploads", filePath), (err) => {
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

module.exports = deleteFile;
