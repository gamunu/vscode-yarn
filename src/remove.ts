import { window as Window } from 'vscode';
import { packageExists } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export function yarnRemovePackage() {
    return _removePackage();
};

const _removePackage = function () {
    if (!packageExists()) {
        Messages.noPackageError();
        return;
    }

    Window.showInputBox({
        prompt: 'Package to remove',
        placeHolder: 'lodash, underscore, ...'
    })
        .then((value) => {

            if (!value) {
                Messages.noValueError();
                return;
            }

            const packages = value.split(' ');

            const args = ['remove', ...packages];

            runCommand(args);
        });
};