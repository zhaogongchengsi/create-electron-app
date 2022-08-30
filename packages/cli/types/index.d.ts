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
}

export interface ServeOptions extends CommonOptions {
  host?: number;
  port?: number;
  open?: boolean;
}

export interface buildOptions extends CommonOptions {}

export interface Server {
  host?: string;
  port?: string;
  open?: string;
}

export interface UseConfig {
  main: string[];
  renderer: string[];
  server?: Server;
}
