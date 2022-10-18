#!/usr/bin/env node

const path = require("path");
const { createDir, copyDir, createFile } = require("./util");
const creafgePackage = require("./templates/package.js");

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
      devDependencies: { a: 1 },
    }),
    ".json"
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
