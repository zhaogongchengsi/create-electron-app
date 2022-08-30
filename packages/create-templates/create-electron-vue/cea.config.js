const conf = {
  main: [
    {
      input: "./main/index.ts",
      prload: "./main/preload.ts",
    },
  ],
  renderer: [],
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
  },
};

module.exports = conf;
