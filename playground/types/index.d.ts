
declare module 'import-meta' {
    interface ImportMeta {
        app: Record<string, any>;
        env: Record<string, string>
    }
}