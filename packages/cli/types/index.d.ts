export interface CommonOptions {
  /**
   *配置文件的路径
   */
  configFilePath: string;

  /**
   * 执行的目录 （execute directory）
   */
  root: string;

  /**
   * 临时执行的目录
   */
  tempDirName?: string;

  /**
   * app 输出目录
   */
  outDir?: string;
}

export interface ServeOptions extends CommonOptions {
  host?: number;
  port?: number;
  open?: boolean;
}

export interface buildOptions extends CommonOptions {}

export interface WindowsMain {
  input: string;
  preload?: string;
}

export interface WindowsRenderer {
  viteConfigFile: string;
}

export type Main = WindowsMain | string;
export type Renderer = string;

export interface UseConfig {
  main: Main;
  renderer: Renderer;
  outDir?: string;
}

export interface ElectronAssets {
  mode: "production" | "development";
  preload?: string;
  loadUrl: string | number;
}
