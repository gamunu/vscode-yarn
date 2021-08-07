import * as Fs from 'fs';
import * as Path from 'path';
import * as Messages from './messages';
import { workspace as Workspace, window as Window, QuickPickItem } from 'vscode';

// Explorer context menu command argument
export interface CommandArgument {
	fsPath: string;
}

interface PackageJsonRoot {
	fsPath: string;
	name: string;
}

export async function pickPackageJson(): Promise<Readonly<string>> {
	// if active text editor is a package.json turn the path for it
	const editor = Window.activeTextEditor;
	if (editor && editor.document.fileName.match("package.json")) {
		return editor.document.fileName;
	}

	let workspaceFolders = Workspace.workspaceFolders

	if (workspaceFolders !== undefined) {
		// find if we have more than one workspace / multi root
		let nodeWorkspaces: PackageJsonRoot[] = []

		workspaceFolders.forEach(workspace => {
			// get package json path for workspace folder
			let conf = Workspace.getConfiguration('yarn', workspace)['packageJson'];
			// look for root directory for package json
			let packageJson = Path.join(workspace.uri.fsPath, conf);

			if (Fs.existsSync(packageJson)) {
				nodeWorkspaces.push({ name: workspace.name, fsPath: packageJson });
			}
		});

		if (nodeWorkspaces.length > 1) {
			//if we have many show quick pick to identify the folder
			const items: QuickPickItem[] = nodeWorkspaces.map((workspace) => {
				return { label: workspace.name, description: workspace.fsPath };
			});
			let item = await Window.showQuickPick(items, { ignoreFocusOut: true, canPickMany: false })
			if (undefined === item) {
				Messages.noValueError();
				return undefined;
			}
			return nodeWorkspaces.filter(w => w.name === item.label)[0].fsPath;
		} else if (nodeWorkspaces.length == 1) {
			return nodeWorkspaces[0].fsPath
		}
	}
	return undefined
}

export function packageExists(packageJson: string) {
	try {
		const stat = Fs.statSync(packageJson);
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

export function dontHideOutputOnSuccess() {
	return Workspace.getConfiguration('yarn')['dontHideOutputOnSuccess'];
}
