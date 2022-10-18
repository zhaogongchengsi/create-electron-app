const fs = require("fs");
const path = require("path");
const https = require("https");

const { cp } = require("fs/promises");

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

const createFile = async (name, filePath, date, ext = "js") => {
  const p = path.join(filePath, name) + ext;
  return new Promise((res, rej) => {
    const data = new Uint8Array(Buffer.from(date));
    fs.writeFile(p, data, (err) => {
      if (err) rej(err);
      res(p);
    });
  });
};

const readFile = (p) => {
  return new Promise((res, rej) => {
    fs.readFile(path.join(__dirname, p), (err, data) => {
      if (err) rej(err);
      res(data);
    });
  });
};

/**
 *
 * @param {string} targetPath 复制的目标文件夹
 * @param {string} originPath 复制的源文件夹
 */
const copyDir = async (targetPath, originPath) => {
  return cp(originPath, targetPath, {
    recursive: true,
  });
};

const createTab = (length = 2) => {
  return Array(length).fill(" ").join("");
};

function getPackageVersion(name) {
  // 从 npmjs 中获取版本号
  return new Promise((resolve, reject) => {
    https
      .get(`https://registry.npmjs.org/${name}`, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const latest = (JSON.parse(data)[`dist-tags`] || {}).latest; // 获取最新版本
          resolve(latest);
        });
      })
      .on(`error`, (err) => {
        throw new Error(err.message);
      });
  });
}

module.exports = {
  createDir,
  createFile,
  readFile,
  copyDir,
  createTab,
  getPackageVersion,
};
