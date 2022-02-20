import { window as Window, Uri } from 'vscode';
import { packageExists, pickPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export async function yarnPublish(arg: Uri) {
	let packageJson: string = null
	let cmd: string = 'publish'

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
		prompt: 'Optional tag (enter to skip tag)',
		placeHolder: 'latest, 1.0.0, ...'
	})
		.then((value) => {

			if (!value) {
				runCommand([cmd], packageJson);
				return;
			}

			if (value.includes(' ')) {
				Messages.invalidTagError();
				return;
			}

			runCommand([cmd, '--tag', value], packageJson);
		});
};
