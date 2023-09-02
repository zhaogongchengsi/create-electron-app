export type devtoolType = "edge" | "chrome";

export type devtool = {
    name: string;
    type?: devtoolType;
    id: string;
};

export type devtools = devtool[];