const fs = require("fs");
const path = require("path");

const createDir = async (name, dirPath = process.cwd()) => {
  return new Promise((res, rej) => {
    fs.mkdir(path.resolve(dirPath, name), { recursive: true }, (err, path) => {
      if (err) {
        rej(err);
      }
      res(path);
    });
  });
};

const createFile = async (name, filePath, date, ext = js) => {
  const path = path.join(filePath, name) + ext;
  return new Promise((res, rej) => {
    const data = new Uint8Array(Buffer.from(date));
    fs.writeFile(path, data, (err) => {
      if (err) rej(err);
      res(path);
      console.log("The file has been saved!");
    });
  });
};

module.exports = {
  createDir,
  createFile,
};
