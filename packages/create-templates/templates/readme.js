module.exports = function createReadme({ appName = "", description = "" }) {
  return `
# ${appName}

## description

${description}
`.trim();
};
