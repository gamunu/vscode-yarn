import { window as Window, Uri } from 'vscode';
import { packageExists, pickPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export async function yarnRemovePackage(arg: Uri) {
	let packageJson: string = null

	// context menu wins always
	if (arg.fsPath.length >= 0) {
		packageJson = arg.fsPath;
	} else { // fall back to pick
		packageJson = await pickPackageJson()
	}

	if (!packageExists(packageJson)) {
		Messages.noPackageError();
		return;
	}

	Window.showInputBox({
		prompt: 'Package to remove',
		placeHolder: 'lodash, underscore, ...'
	})
		.then((value) => {

			if (!value) {
				Messages.noValueError();
				return;
			}

			const packages = value.split(' ');

			const args = ['remove', ...packages];

			runCommand(args, packageJson);
		});
}
