# devtools-install

Install the chord extension for electron

Install the extensions already installed in the local browser

# Usage

```ts
// index.ts
import { devtoolsInstall } from "@zzhaon/devtools-install";

devtoolsInstall([
  {
    name: "vue",
    type: "edge", // The installation type of the plug-in (on which browser the plug-in is installed) default: edge
    id: "sadfijoaigoerigerwgergi", // id  Edge: extension ->management extension ->extension id
  },
]);
```

![extensions id](./imags/extensions.png)
