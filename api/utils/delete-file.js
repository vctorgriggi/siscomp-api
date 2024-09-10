const path = require("path");
const fs = require("fs");

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(path.resolve(filePath));
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
};

module.exports = deleteFile;
