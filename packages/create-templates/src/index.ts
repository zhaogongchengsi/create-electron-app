#!/usr/bin/env node

import prompts from "prompts";
import consola from 'consola';
import { colors } from 'consola/utils';
import { join, resolve } from "node:path";
import { outputFile } from 'fs-extra/esm'
import { readFile } from 'fs/promises'

const tempPath = resolve(__dirname, "../templates")
const commonPath = join(tempPath, "../templates/common")
const envFile = join(commonPath, 'env.d.ts')
const tsconfigFile = join(commonPath, 'tsconfig.json')

interface Folder {
	path: string
	content: string
}

const readFileToString = async (path: string) => {
	const buf = await readFile(path)
	return buf.toString()
};

;(async () => {
	const root = process.cwd()
	const { projectName, language, frame } = await prompts([
		{
			name: "projectName",
			type: "text",
			message: "Your Project Name?",
			initial: 'new-app'
		},
		{
			name: "language",
			type: "toggle",
			initial: true,
			active: colors.red('ts'),
			inactive: colors.cyan('js'),
			message: "choose language",
		},
		{
			name: "frame",
			type: "select",
			choices: [
				{ title: "Vue", value: "vue" },
				{ title: "React", value: "react" },
				{ title: "Vanilla", value: "vanilla" },
			],
			message: "choose frame",
		},
	]);

	const ext = language ? 'ts' : 'js';
	const extx = language ? 'tsx' : 'jsx'

	const caeConfigFile = join(commonPath, `cea.config.${ext}`);
	const appIndexFile = join(commonPath, `index.${ext}`)
	const appPreloadFile = join(commonPath, `preload.${ext}`)
	const indexHtmlFile = join(commonPath, 'index.html')

	const projectDir = join(root, projectName);

	const appDir = join(projectDir, 'app')
	const srcDir = join(projectDir, 'src')

	const webDir = join(tempPath, frame)
	const webIndexFile = join(webDir, `index.${ext}`)
	const webAppFile = join(webDir, `App.${extx}`)


	const projectFolderList: Folder[] = [
		{
			path: join(appDir, `index.${ext}`),
			content: await readFileToString(appIndexFile)
		},
		{
			path: join(appDir, `preload.${ext}`),
			content: await readFileToString(appPreloadFile)
		},
		{
			path: join(appDir, `cea.config.${ext}`),
			content: await readFileToString(caeConfigFile)
		},
		{
			path: join(srcDir, `index${ext}`),
			content: await readFileToString(webIndexFile)
		},
		{
			path: join(srcDir, `App${extx}`),
			content: await readFileToString(webAppFile)
		},
		{
			path: join(projectDir, `index.html`),
			content: await readFileToString(indexHtmlFile)
		},
		language && {
			path: join(projectDir, `env.d.${ext}`),
			content: await readFileToString(envFile)
		},
		language && {
			path: join(projectDir, "tsconfig.json"),
			content: await readFileToString(tsconfigFile)
		}
	].filter(Boolean)

	consola.start('create ...')

	for (const { path, content } of projectFolderList) {
		await outputFile(path, content)
	}

	consola.success('end')

})()