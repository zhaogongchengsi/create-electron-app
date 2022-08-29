const conf = {
  main: ["./packages/main/index"],
  renderer: ["./packages/renderer/index"],
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
  },
};

module.exports = conf;
