const { createTab } = require("../util.js");

function formatDep(dep = {}) {
  const _dep = [];

  for (const key in dep) {
    if (Object.hasOwnProperty.call(dep, key)) {
      _dep.push(`${createTab(8)}"${key}": "${dep[key]}"`);
    }
  }

  return "{\n" + _dep.join("\n") + `\n${createTab(4)}}`;
}

module.exports = function creafgePackage({ name, author, devDependencies }) {
  return `
    {
    "name": "${name ?? "An app without a name"}",
    "version": "1.0.0",
    "description": "${name} description of the software",
    "main": "./main/index.ts",
    "author": "${author} ?? The author doesn't know who",
    "devDependencies":  ${formatDep(devDependencies)}
}
    `.trim();
};
