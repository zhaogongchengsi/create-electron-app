// @ts-nocheck

const closeId = "_cea_:app-windows-all_close";
electron.app.on("will-quit", () => {
  process.send(closeId);
});
