import { commands as Commands, ExtensionContext } from 'vscode';

import { outputChannel } from './output';
import * as Messages from './messages';
import { runCommand } from './run-command';

import yarnInit from './init';
import { yarnInstallPackage, yarnInstallSavedPackages } from './install';
import { yarnAddPackages, yarnAddPackage, yarnAddPackageDev } from './add';
import { yarnRemovePackage } from './remove';
import { yarnRunScript, yarnRunLastScript, yarnStart, yarnTest } from './run';
import { yarnPublish } from './publish';
import { yarnRawCommand } from './raw';
import yarnTerminate from './terminate';

export const activate = function (context: ExtensionContext) {

    const disposables = [
        Commands.registerCommand('yarn-script.installSavedPackages', yarnInstallSavedPackages),  
        Commands.registerCommand('yarn-script.installPackage', yarnInstallPackage),
        Commands.registerCommand('yarn-script.addPackages', yarnAddPackages),
        Commands.registerCommand('yarn-script.addPackage', yarnAddPackage),
        Commands.registerCommand('yarn-script.addPackageDev', yarnAddPackageDev),
        Commands.registerCommand('yarn-script.runScript', yarnRunScript),
        Commands.registerCommand('yarn-script.runScriptLatest', yarnRunLastScript),
        Commands.registerCommand('yarn-script.init', yarnInit),
        Commands.registerCommand('yarn-script.removePackage', yarnRemovePackage),
        Commands.registerCommand('yarn-script.publish', yarnPublish),
        Commands.registerCommand('yarn-script.raw', yarnRawCommand),
        Commands.registerCommand('yarn-script.terminate', yarnTerminate),
        Commands.registerCommand('yarn-script.test', yarnTest),
        Commands.registerCommand('yarn-script.start', yarnStart)
    ];
    
	context.subscriptions.push(...disposables, outputChannel);
}

export function deactivate() {
}