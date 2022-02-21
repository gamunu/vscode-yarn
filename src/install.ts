import { getPackageJson } from './utils';
import { Uri } from 'vscode';
import { runCommand } from './run-command';

export async function yarnInstallPackages(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	runCommand(['install'], packageJson);
}
