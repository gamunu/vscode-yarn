import { window as Window, Uri } from 'vscode';
import { getPackageJson } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export async function yarnPublish(arg: Uri) {
	const cmd: string = 'publish';
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	Window.showInputBox({
		prompt: 'Optional tag (enter to skip tag)',
		placeHolder: 'latest, 1.0.0, ...'
	})
		.then((value) => {

			if (!value) {
				runCommand([cmd], packageJson);
				return;
			}

			if (value.includes(' ')) {
				Messages.invalidTagError();
				return;
			}

			runCommand([cmd, '--tag', value], packageJson);
		});
};
