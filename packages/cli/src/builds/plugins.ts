import { PluginBuild } from "esbuild";
import { readFile } from "fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "path";
import { pathToFileURL } from "url";
import { lookupFile } from "../utils";

export const esbuildPlugingExternalizeDeps = (
  fileName: string,
  isESM: boolean
) => {
  return {
    name: "externalize-deps",
    setup(build: PluginBuild) {
      build.onResolve({ filter: /.*/ }, ({ path: id, importer }) => {
        if (id[0] !== "." && !isAbsolute(id)) {
          return {
            external: true,
          };
        }
        const idPath = resolve(dirname(importer), id);
        const idPackAgePath = lookupFile(idPath, [`package.json`], {
          pathOnly: true,
        });
        if (idPackAgePath) {
          const idPkgDir = dirname(idPackAgePath);
          if (relative(idPkgDir, fileName).startsWith("..")) {
            return {
              path: isESM ? pathToFileURL(idPath).href : idPath,
              external: true,
            };
          }
        }
      });
    },
  };
};

export const DIR_NAME_VAR = "__dirname_var";
export const FILE_NAME_VAR = "__filename_var";
export const IMPORT_META_URE_VAR = "import_meta_var";

export const esbuildPlugingInjectFileScopeVariables = () => {
  return {
    name: "inject-file-scope-variables",
    setup(build: PluginBuild) {
      build.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
        const contents = await readFile(args.path, "utf8");
        const injectValues =
          `const ${DIR_NAME_VAR} = ${JSON.stringify(dirname(args.path))};` +
          `const ${FILE_NAME_VAR} = ${JSON.stringify(args.path)};` +
          `const ${IMPORT_META_URE_VAR} = ${JSON.stringify(
            pathToFileURL(args.path).href
          )};`;

        return {
          loader: args.path.endsWith("ts") ? "ts" : "js",
          contents: injectValues + contents,
        };
      });
    },
  };
};

function escapeRegExp(string: string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function esbuildPlugingAlias(alias: Record<string, string> = {}) {
  const aliases = Object.keys(alias);
  const re = new RegExp(
    `^(${aliases.map((x) => escapeRegExp(x)).join("|")})(\/.*)`
  );

  return {
    name: "esbuild-pluging-alias",
    setup(build: PluginBuild) {
      build.onResolve({ filter: re }, ({ path }) => {

        const resMatch = path.match(re);

        
        const basePath = resMatch![1];

        const p = join(alias[basePath], resMatch![2] ?? "");

        return {
          path: p,
        };
      });
    },
  };
}
