import { getPackageJson } from './utils';
import { Uri } from 'vscode';
import { runCommand } from './run-command';

/**
 * Run yarn outdated command
 *
 * @param arg path to the file where command orignated
 * @returns void
 */
export async function yarnOutdated(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	runCommand(['outdated'], packageJson);
}
