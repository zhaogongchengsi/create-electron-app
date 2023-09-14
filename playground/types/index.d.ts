

declare type MultiplePage = Record<string, string>
declare type Page = MultiplePage | string

declare interface ImportMeta {
    app: {
        page: Page
        preload: string
    };
    env: Record<string, string>
}

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.ico' {
    const value: string;
    export default value;
}
