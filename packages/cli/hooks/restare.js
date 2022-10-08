// @ts-nocheck
const electron = require("electron");

electron.app.on("will-quit", () => {
  process.send("_cea_:app-windows-all_close");
});
