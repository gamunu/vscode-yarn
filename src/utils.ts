import * as Fs from 'fs';
import * as Path from 'path';
import { workspace as Workspace, window } from 'vscode';

// Explorer context menu command argument
export interface CommandArgument {
	fsPath: string;
}

export function packageExists(arg?: CommandArgument) {
	if (!Workspace.rootPath) {
		return false;
	}

	let filepath = Path.join(Workspace.rootPath, 'package.json');
	const confPackagejson = Workspace.getConfiguration('yarn')['packageJson'];

	if (confPackagejson) {
		filepath = Path.join(Workspace.rootPath, confPackagejson);
	}

	const editor = window.activeTextEditor;
	if (editor && editor.document.fileName.endsWith("package.json")) {
		filepath = editor.document.fileName;
	}

	// If the runCommand exected via Explorer contect menu
	if (arg && arg.fsPath) {
		filepath = arg.fsPath;
	}

	try {
		const stat = Fs.statSync(filepath);
		return stat && stat.isFile();
	}
	catch (ignored) {
		return false;
	}
}

export function useTerminal() {
	return Workspace.getConfiguration('yarn')['runInTerminal'];
}

export function getYarnBin() {
	return Workspace.getConfiguration('yarn')['bin'] || 'yarn';
}

export function startScript() {
	return Workspace.getConfiguration('yarn')['startScript'] || 'start';
}

export function dontHideOutputOnSuccess() {
	return Workspace.getConfiguration('yarn')['dontHideOutputOnSuccess'];
}
