import { window as Window } from 'vscode';
import { packageExists, pickPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export function yarnRemovePackage() {
	return _removePackage();
}

const _removePackage = async function () {
	let packageJson = await pickPackageJson()
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
};
