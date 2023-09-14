import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Create Electron App",
  description: "A VitePress Site",
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    cn: {
      label: '中文',
      lang: 'cn', // optional, will be added  as `lang` attribute on `html` tag
      link: '/cn/' // default /fr/ -- shows on navbar translations menu, can be external
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide/index.md' }
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhaogongchengsi/create-electron-app' }
    ]
  }
})
