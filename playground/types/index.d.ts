
declare interface ImportMeta {
    app: {
        page: Record<string, any> | string
        preload: string
    };
    env: Record<string, string>
}