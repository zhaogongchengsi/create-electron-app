

declare type MultiplePage = Record<string, string>
declare type Page = MultiplePage | string

declare interface ImportMeta {
    app: {
        page: Page
        preload: string
    };
    env: Record<string, string>
}