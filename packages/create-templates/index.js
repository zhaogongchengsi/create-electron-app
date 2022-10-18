#!/usr/bin/env node

const path = require("path");
const {
  createDir,
  copyDir,
  createFile,
  getPackageVersion,
  pathExist,
} = require("./util");
const creafgePackage = require("./templates/package.js");
const createReadme = require("./templates/readme.js");
const createGitIgnore = require("./templates/gitignore.js");

const tempPath = (name = "vue", isTs = false) =>
  path.resolve(__dirname, `./templates/${name}${isTs ? "-ts" : ""}`);

const tempMainPath = (isTs = false) => {
  return path.resolve(__dirname, `./templates/main${isTs ? "-ts" : ""}`);
};

const prompts = require("prompts");
const { join } = require("path");
const { statSync } = require("fs");

(async () => {
  const root = process.cwd();

  const result = await prompts([
    {
      name: "projectName",
      type: "text",
      message: "Your Project Name?",
    },
    {
      name: "language",
      type: "select",
      choices: [
        { title: "Typescript", value: "ts" },
        { title: "Javascript", value: "js" },
      ],
      message: "Choose the language to use",
    },
    {
      name: "frame",
      type: "select",
      choices: [
        { title: "Vue", value: "vue" },
        { title: "React", value: "react" },
        { title: "Vanilla", value: "vanilla" },
      ],
      message: "choose frame",
    },
  ]);

  // const dep = await getDepVersion();

  const dep = {
    "@zzhaon/create-electron-app": "0.2.7",
    vite: "3.1.8",
    electron: "21.1.1",
    "electron-builder": "23.6.0",
  };

  const isTs = () => language === "ts";

  const { projectName, language, frame } = result;

  const ppath = join(root, projectName);

  let proName = "";
  if (await pathExist(ppath)) {
    proName = "-app";
  }

  const projectNamePath = await createDir(projectName + proName, root);
  const mainPath = await createDir("main", projectNamePath);

  const templatePaht = tempPath(frame, isTs());
  console.log(projectNamePath);
  await copyDir(projectNamePath, templatePaht);
  await copyDir(mainPath, tempMainPath(isTs()));

  await createFile(
    "package",
    projectNamePath,
    creafgePackage({
      name: projectName,
      author: "zzh",
      main: "",
      dep,
    }),
    ".json"
  );

  await createFile(
    "README",
    projectNamePath,
    createReadme({
      appName: projectName,
      description: "Electron vite esbuild app",
    }),
    ".md"
  );

  await createFile(".gitignore", projectNamePath, createGitIgnore(), "");

  console.log(
    `
      cd ${projectName}

      npm install

      npm install electron electron-builder
      
      npm run dev
    `
  );
})();

const DEP_NAME = [
  "electron",
  "vite",
  "@zzhaon/create-electron-app",
  "electron-builder",
];

async function getDepVersion(depNames = DEP_NAME) {
  const res = await Promise.all(
    depNames.map((name) => getPackageVersion(name))
  );
  const dep = {};
  DEP_NAME.forEach((name, index) => {
    dep[name] = res[index];
  });

  return dep;
}
