import { window as Window } from 'vscode';
import { packageExists, pickPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

/**
 * Run yarn command
 *
 * @returns void
 */
export async function yarnRawCommand() {
	const packageJson = await pickPackageJson();
	if (!packageExists(packageJson)) {
		Messages.noPackageError();
		return;
	}

	Window.showInputBox({
		prompt: 'yarn command',
		placeHolder: 'install lodash@latest, ...'
	})
		.then((value) => {

			if (!value) {
				Messages.noValueError();
				return;
			}

			const args = value.split(' ');

			runCommand(args, packageJson);
		});
}
