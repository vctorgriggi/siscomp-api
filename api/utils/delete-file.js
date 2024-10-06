const path = require("path");
const fs = require("fs");

const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(path.resolve(filePath));
  } catch (error) {
    console.warn(
      `Occurred an problem while trying to delete the file: ${filePath}`,
      error.message
    );
  }
};

module.exports = deleteFile;
