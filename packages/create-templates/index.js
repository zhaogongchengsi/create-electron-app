#!/usr/bin/env node

// @ts-check

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
        { title: "Javascript", value: "ts" },
        { title: "Typescript", value: "js" },
      ],
      message: "Choose the language to use",
    },
    {
      name: "frame",
      type: "select",
      choices: [
        { title: "React", value: "react" },
        { title: "Vue", value: "vue" },
      ],
      message: "choose frame",
    },
  ]);

  console.log(root, result);
})();
