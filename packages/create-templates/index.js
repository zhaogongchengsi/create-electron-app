#!/usr/bin/env node

const path = require("path");
const { createDir, copyDir, createFile, getPackageVersion } = require("./util");
const creafgePackage = require("./templates/package.js");
const createReadme = require("./templates/readme.js");

const tempPath = (name = "vue", isTs = false) =>
  path.resolve(__dirname, `./templates/${name}${isTs ? "-ts" : ""}`);

const tempMainPath = (isTs = false) => {
  return path.resolve(__dirname, `./templates/main${isTs ? "-ts" : ""}`);
};

const prompts = require("prompts");

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
        { title: "Javascript", value: "js" },
        { title: "Typescript", value: "ts" },
      ],
      message: "Choose the language to use",
    },
    {
      name: "frame",
      type: "select",
      choices: [
        { title: "React", value: "react" },
        { title: "Vue", value: "vue" },
        { title: "Vanilla", value: "vanilla" },
      ],
      message: "choose frame",
    },
  ]);

  const dep = await getDepVersion();

  const isTs = () => language === "ts";

  const { projectName, language, frame } = result;

  const projectNamePath = await createDir(projectName, root);
  const mainPath = await createDir("main", projectNamePath);

  const templatePaht = tempPath(frame, isTs());
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
    createReadme({ appName: projectName, description: "1231" }),
    ".md"
  );

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

async function getDepVersion() {
  const res = await Promise.all(
    DEP_NAME.map((name) => getPackageVersion(name))
  );

  const dep = {};

  DEP_NAME.forEach((name, index) => {
    dep[name] = res[index];
  });

  return dep;
}
