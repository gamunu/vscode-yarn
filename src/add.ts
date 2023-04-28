import { window as Window, Uri } from 'vscode';
import { getPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

/**
 * Add packages to the project using yarn add command
 *
 * @param arg path to the file where command orignated
 * @returns void
 */
export async function yarnAddPackages(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	runCommand(['add'], packageJson);
}

/**
 * Add packages to the project using yarn add command
 *
 * @param arg path to the file where command orignated
 * @returns void
 */
export function yarnAddPackage(arg: Uri) {
	return _addPackage(false, arg);
}

/**
 * Add packages to the project using yarn add command
 * with --dev option
 * @param arg path to the file where command orignated
 * @returns void
 */
export function yarnAddPackageDev(arg: Uri) {
	return _addPackage(true, arg);
}

/**
 * Add packages to the project using yarn add command with --dev option
 *
 * @param dev boolean
 * @param arg path to the file where command orignated
 * @returns void
 */
const _addPackage = async function (dev: boolean, arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

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
