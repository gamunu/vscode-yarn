import { getPackageJson } from './utils';
import { Uri } from 'vscode';
import { runCommand } from './run-command';

export async function yarnOutdated(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	runCommand(['outdated'], packageJson);
}
