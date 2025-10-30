const fs = require("fs").promises;

exports.deleteFile = async (path) => {
  try {
    await fs.unlink(path);
    console.log(`File deleted: ${path}`);
  } catch (err) {
    console.error(`Failed to delete file: ${err.message}`);
  }
};
