# create-electron-app

![create-electron-app](https://img.shields.io/npm/v/@zzhaon/create-electron-app?color=red&label=create-electron-app)

🔊 Create electron App is a way to create electron applications. Just need a simple configuration to focus on the business without paying attention to the details of application construction

## Install

```sh

npm install  @zzhaon/create-electron-app --save -d

pnpm add  @zzhaon/create-electron-app --save-dev

```

## Tip ❗

Users need to manually download electron and electron-builder by themselves

```sh

npm install electron electron-builder --save -dev

```

## Usage

## 1. The simplest first

> Configure the `main` field of the `package.json`, which is the entry file of electron
>
> In the project root directory, configure a `vite.config` file, and the configuration of all rendering layers is based on changing the file

## 2. According to the second way of using the configuration file

Then add the command

```json
    "script": {
        "dev": "cea",
        "build": "cea build",
    }
```

> Create a js or ts file named cea.config

---

# Configuration

- ### `main`
  `string | {input:string, preload:string}` required
  - `input` Main process entry file
  - `preload` preload entry file
- ### `vite`

  `string | {input:string, preload:string}` required

  Vite's configuration file path

- ### `watch`

  `boolean` default: true

  Whether to restart the application when the main process file changes

- ### `tempDirName`

  `string` default: '.app'

  Generate the name of the temporary run directory, based on the project root directory

- ### `outDir`

  `string` default: dist

  The directory where the built js file is output

- ### `appOutDir`

  `string` default: 'releases'

  The output directory of the application

## Documentation

To be developed...
