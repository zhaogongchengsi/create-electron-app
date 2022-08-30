import { join, parse } from "path";
import { createServer } from "vite";
import { UseConfig } from "../../types";

export async function createViteServer(root: string, { renderer }: UseConfig) {
  const { dir, base } = parse(join(root, renderer));

  //   console.log(dir, base, "\n", join(dir, base));

  const server = await createServer({
    root: dir,
    configFile: join(dir, base),
  });

  if (!server.httpServer) {
    throw new Error("HTTP server not available");
  }

  return server;
}
