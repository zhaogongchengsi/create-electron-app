import { defineConfig } from "vitepress";

export default defineConfig({
  title: `create electron app`,
  description: "Next Generation Frontend Tooling",

  head: [
    ["link", { rel: "icon", type: "image/png", href: "/logo.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "create-electron-app" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Next Generation Frontend Tooling",
      },
    ],
  ],

  themeConfig: {
    logo: "/logo.png",

    editLink: {
      pattern:
        "https://github.com/zhaogongchengsi/create-electron-app/tree/master/docs/:path",
      text: "纠错",
    },

    nav: [
      { text: "快速开始", link: "/guide/", activeMatch: "/guide/" },
      { text: "配置", link: "/configs/", activeMatch: "/configs/" },
      {
        text: "devtool-install",
        link: "/devtools_install/",
        activeMatch: "/devtools_install/",
      },
    ],

    localeLinks: {
      text: "简体中文",
      items: [{ text: "简体中文", link: "123" }],
    },

    sidebar: {
      "/guide/": [
        {
          text: "指引",
          items: [
            {
              text: "快速开始",
              link: "/guide/index",
            },
            {
              text: "为什么选择cea",
              link: "/guide/why",
            },
            {
              text: "CLI",
              link: "/guide/cli",
            },
            {
              text: "环境变量与模式",
              link: "/guide/env",
            },
            {
              text: "使用插件",
              link: "/guide/plugins",
            },
            {
              text: "调试",
              link: "/guide/debug",
            },
          ],
        },
      ],
      "/configs/": [
        {
          text: "配置",
          items: [
            {
              text: "配置",
              link: "/configs/index",
            },
          ],
        },
      ],
    },
  },
});
