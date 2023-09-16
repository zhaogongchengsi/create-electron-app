
declare module "*.png" {
  const url: string;
  export default url;
}
declare module "*.jpg" {
  const url: string;
  export default url;
}
declare module "*.jpeg" {
  const url: string;
  export default url;
}

declare type MultiplePage = Record<string, string>
declare type Page = MultiplePage | string

declare interface ImportMeta {
  app: {
    page: Page
    preload: string
  };
  env: Record<string, string>
}

