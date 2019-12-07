import { window as Window } from 'vscode';
import { packageExists } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export function yarnPublish() {
	_do('publish');
};

const _do = function (cmd: string) {
	if (!packageExists()) {
		Messages.noPackageError();
		return;
	}

	Window.showInputBox({
		prompt: 'Optional tag (enter to skip tag)',
		placeHolder: 'latest, 1.0.0, ...'
	})
		.then((value) => {

			if (!value) {
				runCommand([cmd]);
				return;
			}

			if (value.includes(' ')) {
				Messages.invalidTagError();
				return;
			}

			runCommand([cmd, '--tag', value]);
		});
};
