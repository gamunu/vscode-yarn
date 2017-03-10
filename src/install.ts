
import { window as Window } from 'vscode';

import { packageExists } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';


export function yarnInstallSavedPackages() {

    if (!packageExists()) {
        Messages.noPackageError();
        return;
    }

    runCommand(['install']);
};

export function yarnInstallPackage() {

    return _installPackage(false);
};

const _installPackage = function (dev) {

    if (!packageExists()) {
        Messages.noPackageError();
        return;
    }

    Window.showInputBox({
        prompt: 'Package to install',
        placeHolder: 'lodash, underscore, ...'
    })
        .then((value) => {

            if (!value) {
                Messages.noValueError();
                return;
            }
            const packages = value.split(' ');
            const args = ['install', ...packages];
            runCommand(args);
        });
};