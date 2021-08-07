import { packageExists, CommandArgument, pickPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export async function yarnInstallPackages(arg: CommandArgument) {
	let packageJson = null

	// context menu wins always
    if (arg !== undefined) {
		packageJson = arg.fsPath;
	} else { // fall back to pick
		packageJson = await pickPackageJson()
	}

	if (!packageExists(packageJson)) {
		Messages.noPackageError();
		return;
	}
	runCommand(['install'], packageJson);
}
