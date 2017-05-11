import { window as Window } from 'vscode';
import { packageExists } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export function yarnAddPackages() {
    if (!packageExists()) {
        Messages.noPackageError();
        return;
    }

    runCommand(['add']);
};

export function yarnAddPackage() {
    return _addPackage(false);
};

export function yarnAddPackageDev() {
    return _addPackage(true);
};

const _addPackage = function (dev) {
    if (!packageExists()) {
        Messages.noPackageError();
        return;
    }

    Window.showInputBox({
        prompt: 'Package to add',
        placeHolder: 'lodash, underscore, ...'
    })
        .then((value) => {

            if (!value) {
                Messages.noValueError();
                return;
            }

            const packages = value.split(' ');

            const hasSaveOption = packages.find((value) => {

                return value === '-D' ||
                    value === '--dev' ||
                    value === '-O' ||
                    value === '--optional' ||
                    value === '-E' ||
                    value === '--exact'
            });

            const args = ['add', ...packages];

            if (hasSaveOption) {
                runCommand(args);
            }
            else {
                const save = dev ? '--dev' : '';
                runCommand([...args, save])
            }
        });
};