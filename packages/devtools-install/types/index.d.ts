export type devtoolType = "edge" | "chrome";

export type devtool = {
  name: string;
  type?: devtoolType;
  id: string;
};

export type devtools = devtool[];

export declare function devtoolsInstall(devtools?: devtools): Promise<void>;
