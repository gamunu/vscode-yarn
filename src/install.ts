import { window as Window } from 'vscode';
import { packageExists, CommandArgument } from './utils';
import * as Messages from './messages';
import { runCommand } from './run-command';

export function yarnInstallPackages(arg: CommandArgument) {
    if (!packageExists()) {
        Messages.noPackageError();
        return;
    }

    runCommand(['install'], arg)
};