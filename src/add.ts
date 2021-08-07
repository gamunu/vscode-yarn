import { window as Window } from 'vscode';
import { packageExists, pickPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export async function yarnAddPackages() {
	let packageJson = await pickPackageJson()
	if (!packageExists(packageJson)) {
		Messages.noPackageError();
		return;
	}

	runCommand(['add'], packageJson);
}

export function yarnAddPackage() {
	return _addPackage(false);
}

export function yarnAddPackageDev() {
	return _addPackage(true);
}

const _addPackage = async function (dev: boolean) {
	let packageJson = await pickPackageJson()
	if (!packageExists(packageJson)) {
		Messages.noPackageError();
		return;
	}

	Window.showInputBox({
		prompt: 'Package to add',
		placeHolder: 'lodash, underscore, ...'
	})
		.then((value) => {

			if (!value) {
				Messages.noValueError();
				return;
			}

			const packages = value.split(' ');

			const hasSaveOption = packages.find((value) => {

				return value === '-D' ||
					value === '--dev' ||
					value === '-O' ||
					value === '--optional' ||
					value === '-E' ||
					value === '--exact';
			});

			const args = ['add', ...packages];

			if (hasSaveOption) {
				runCommand(args, packageJson);
			}
			else {
				const save = dev ? '--dev' : '';
				runCommand([...args, save], packageJson);
			}
		});
};
