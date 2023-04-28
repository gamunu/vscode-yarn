import { getPackageJson } from './utils';
import { Uri } from 'vscode';
import { runCommand } from './run-command';

/**
 * Install packages to the project using yarn install command
 *
 * @param arg path to the file where command orignated
 * @returns void
 */
export async function yarnInstallPackages(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	runCommand(['install'], packageJson);
}
