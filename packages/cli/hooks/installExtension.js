const extensionsName = {
  vue: "vue",
  react: "react",
};

function getExtensionNames() {
  let names = [];
  // @ts-ignore
  extensions.forEach((name) => {
    names.push(extensionsName[name]);
  });
  return names;
}

console.log(getExtensionNames());
