import { window as Window, Uri } from 'vscode';
import { packageExists, pickPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export async function yarnAddPackages(arg: Uri) {
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

	runCommand(['add'], packageJson);
}

export function yarnAddPackage(arg: Uri) {
	return _addPackage(false, arg);
}

export function yarnAddPackageDev(arg: Uri) {
	return _addPackage(true, arg);
}

const _addPackage = async function (dev: boolean, arg: Uri) {
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
