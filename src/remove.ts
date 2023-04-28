import { window as Window, Uri } from 'vscode';
import { getPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

/**
 * Remove packages from the project using yarn remove command
 *
 * @param arg path to the file where command orignated
 * @returns void
 */
export async function yarnRemovePackage(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

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
