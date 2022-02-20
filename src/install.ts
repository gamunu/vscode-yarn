import { packageExists, pickPackageJson } from './utils';
import { Uri } from 'vscode';
import * as Messages from './messages';
import { runCommand } from './run-command';

export async function yarnInstallPackages(arg: Uri) {
	let packageJson: string = null;

	// context menu wins always
	if (arg !== undefined && arg.fsPath.length >= 0) {
		packageJson = arg.fsPath;
	} else { // fall back to pick
		packageJson = await pickPackageJson();
	}

	if (!packageExists(packageJson)) {
		Messages.noPackageError();
		return;
	}
	runCommand(['install'], packageJson);
}
