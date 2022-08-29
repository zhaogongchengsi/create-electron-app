export interface CommonOptions {
    
  /**
   *配置文件的路径
   */
  configFilePath?: string;

  /**
   * 执行的目录 （execute directory）
   */
  root?: string;
}

export interface serveOptions extends CommonOptions {
  host?: number;
  port?: number;
  open?: boolean;
}
