
declare interface ElectronAssets {
  mode: "production" | "development";
  preload: string;
  loadUrl: string;
}

declare const electronAssets: ElectronAssets;

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
