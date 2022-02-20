import { packageExists, pickPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export async function yarnOutdated() {
	const packageJson = await pickPackageJson();
	if (!packageExists(packageJson)) {
		Messages.noPackageError();
		return;
	}

	runCommand(['outdated'], packageJson);
}
