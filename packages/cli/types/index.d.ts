
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'none';
  }
  interface Import {
    meta: {
      env: {
        MODE: string,
        PROD: boolean,
        DEV: boolean,
        root: string,
      },
      appdata: Record<string, any>
    }

  }
}