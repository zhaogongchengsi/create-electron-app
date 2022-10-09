import http, { request } from "http";

export interface AxiosOptions {
  baseUrl?: string;
  port?: string;
  path?: string;
  method?: "GET" | "POST";
}

export function axios(options: AxiosOptions) {
  const _options = options ?? {
    baseUrl: "localhost",
  };

  return new Promise((res, rej) => {
    console.log(_options);
    const req = request({
      host: _options.baseUrl,
      port: _options.port,
      path: _options.path,
      method: _options.method,
    });

    req.on("error", rej);
    req.on("connect", (_, socket, head) => {
      socket.on("data", (chunk) => {
        console.log(chunk.toString());
        res(chunk.toString());
      });
    });
    
    req.end();
  });
}
