import { commands as Commands, ExtensionContext} from 'vscode';
import { outputChannel } from './output';
import { terminal } from './run-command';
import yarnInit from './init';
import { yarnInstallPackages } from './install';
import { yarnAddPackages, yarnAddPackage, yarnAddPackageDev } from './add';
import { yarnRemovePackage } from './remove';
import { yarnRunScript, yarnRunLastScript, yarnStart, yarnBuild, yarnTest } from './run';
import { yarnPublish } from './publish';
import { yarnRawCommand } from './raw';
import yarnTerminate from './terminate';
import { yarnOutdated } from './outdated';
import { yarnSearchPackages } from './search';
import { registerYarnSidebar } from './views/yarnSidebarProvider';
import { YarnSearchProvider, YarnDependenciesProvider } from './views/yarnSidebarProvider';

/**
 * Activate the extension and register all commands and events
 *
 * @param context ExtensionContext
 */
export const activate = function (context: ExtensionContext) {
	// Register the sidebar view
	registerYarnSidebar(context);

	// Note: The sidebar-specific commands (addRegistryFromSidebar, removeRegistryFromSidebar, etc.)
	// are registered in the registerYarnSidebar function directly to avoid duplication
	const dependenciesProvider = new YarnDependenciesProvider();

	const disposables = [
		Commands.registerCommand('yarn-script.installPackages', yarnInstallPackages),
		Commands.registerCommand('yarn-script.addPackages', yarnAddPackages),
		Commands.registerCommand('yarn-script.addPackage', yarnAddPackage),
		Commands.registerCommand('yarn-script.addPackageDev', yarnAddPackageDev),
		Commands.registerCommand('yarn-script.runScript', yarnRunScript),
		Commands.registerCommand('yarn-script.build', yarnBuild),
		Commands.registerCommand('yarn-script.runScriptLast', yarnRunLastScript),
		Commands.registerCommand('yarn-script.init', yarnInit),
		Commands.registerCommand('yarn-script.outdated', yarnOutdated),
		Commands.registerCommand('yarn-script.removePackage', yarnRemovePackage),
		Commands.registerCommand('yarn-script.publish', yarnPublish),
		Commands.registerCommand('yarn-script.raw', yarnRawCommand),
		Commands.registerCommand('yarn-script.terminate', yarnTerminate),
		Commands.registerCommand('yarn-script.test', yarnTest),
		Commands.registerCommand('yarn-script.start', yarnStart),
		Commands.registerCommand('yarn-script.searchPackages', yarnSearchPackages),
		Commands.registerCommand('yarn-search-box.focus', () => {
			const searchProvider = new YarnSearchProvider();
			searchProvider._showSearchBox();
		}),
		Commands.registerCommand('yarn-script.refreshDependencies', () => {
			dependenciesProvider.refreshDependencies();
		})
	];

	context.subscriptions.push(...disposables, outputChannel);
};

/**
 * Deactivate the extension
 * @returns void
 * @export deactivate
 */
export function deactivate() {
	if (terminal) {
		terminal.dispose();
	}
}
