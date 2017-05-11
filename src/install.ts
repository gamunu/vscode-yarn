import { window as Window } from 'vscode';
import { packageExists } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export function yarnInstallPackages() {
    if (!packageExists()) {
        Messages.noPackageError();
        return;
    }

    runCommand(['install']);
};