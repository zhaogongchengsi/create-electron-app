import { defineConfig } from "vitepress";

export default defineConfig({
  title: `create electron app`,
  description: "Next Generation Frontend Tooling",
  themeConfig: {
    // logo: "/logo.svg",

    nav: [
      { text: "快速开始", link: "/guide/", activeMatch: "/guide/" },
      { text: "配置", link: "/configs/", activeMatch: "/configs/" },
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
              text: "环境变量与模式",
              link: "/guide/env",
            },
            {
              text: "使用插件",
              link: "/guide/plugins",
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
