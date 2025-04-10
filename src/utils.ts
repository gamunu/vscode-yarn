import * as Fs from 'fs';
import * as Path from 'path';
import * as Messages from './messages';
import { workspace as Workspace, window as Window, QuickPickItem, Uri } from 'vscode';

interface PackageJsonRoot {
	fsPath: string;
	name: string;
}

let cachedPackageJsonPath: string | null = null;

/**
 * Read scripts from package.json file and return them as an object
 *
 * @returns object
 */
export async function pickPackageJson(): Promise<Readonly<string>> {
	// If we have already cached a package.json path, return it
	if (cachedPackageJsonPath) {
		return cachedPackageJsonPath;
	}

	// if active text editor is a package.json turn the path for it
	const editor = Window.activeTextEditor;
	if (editor && editor.document.fileName.match("package.json")) {
		cachedPackageJsonPath = editor.document.fileName;
		return cachedPackageJsonPath;
	}

	const workspaceFolders = Workspace.workspaceFolders;

	if (workspaceFolders !== undefined) {
		// find if we have more than one workspace / multi root
		const nodeWorkspaces: PackageJsonRoot[] = [];

		workspaceFolders.forEach(workspace => {
			// get package json path for workspace folder
			const conf = Workspace.getConfiguration('yarn', workspace)['packageJson'];
			// look for root directory for package json
			const packageJson = Path.join(workspace.uri.fsPath, conf);

			if (Fs.existsSync(packageJson)) {
				nodeWorkspaces.push({ name: workspace.name, fsPath: packageJson });
			}
		});

		if (nodeWorkspaces.length > 1) {
			//if we have many show quick pick to identify the folder
			const items: QuickPickItem[] = nodeWorkspaces.map((workspace) => {
				return { label: workspace.name, description: workspace.fsPath };
			});
			const item = await Window.showQuickPick(items, { ignoreFocusOut: true, canPickMany: false });
			if (undefined === item) {
				Messages.noValueError();
				return undefined;
			}
			cachedPackageJsonPath = nodeWorkspaces.filter(w => w.name === item.label)[0].fsPath;
			return cachedPackageJsonPath;
		} else if (nodeWorkspaces.length === 1) {
			cachedPackageJsonPath = nodeWorkspaces[0].fsPath;
			return cachedPackageJsonPath;
		}
	}
	return undefined;
}

/**
 * Check the file exisit in the path
 *
 * @param packageJson string location for the file
 * @returns boolean
 */
export function packageExists(packageJson: string) {
	try {
		const stat = Fs.statSync(packageJson);
		return stat && stat.isFile();
	}
	catch (ignored) {
		return false;
	}
}

/**
 * Get the package.json location from context menu or prompt
 * to pick the project location.
 *
 * @param arg path to the file where command orignated
 * @returns
 */
export async function getPackageJson(arg: Uri) {
	let packageJson: string = null;

	// context menu wins always
	if (arg !== undefined && arg.fsPath.length >= 0) {
		packageJson = arg.fsPath;
	} else { // fall back to pick
		packageJson = await pickPackageJson();
	}

	if (!packageExists(packageJson)) {
		Messages.noPackageError();
	}

	return packageJson;
}

/**
 * Get the configured value for the selection between output
 * window and terminal window.
 *
 * @returns WorkspaceConfiguration boolean
 */
export function useTerminal() {
	return Workspace.getConfiguration('yarn')['runInTerminal'];
}

/**
 * Get the configured yarn binary location. If not defualt to 'yarn'
 *
 * @returns WorkspaceConfiguration path to the yarn binary
 */
export function getYarnBin() {
	return Workspace.getConfiguration('yarn')['bin'] || 'yarn';
}

/**
 * Get the configuration value for the output window autohide feature
 *
 * @returns WorkspaceConfiguration boolen value
 */
export function dontHideOutputOnSuccess() {
	return Workspace.getConfiguration('yarn')['dontHideOutputOnSuccess'];
}

/**
 * Get installed dependencies from package.json
 *
 * @param packageJsonPath path to package.json file
 * @returns object with dependencies and devDependencies
 */
export function getInstalledDependencies(packageJsonPath: string) {
	try {
		const content = Fs.readFileSync(packageJsonPath).toString();
		const json = JSON.parse(content);
		return {
			dependencies: json.dependencies || {},
			devDependencies: json.devDependencies || {}
		};
	} catch (error) {
		console.error('Error reading dependencies:', error);
		return { dependencies: {}, devDependencies: {} };
	}
}

/**
 * Perform an npm search with a cooldown to avoid rate limits.
 *
 * @param searchTerm string term to search for
 * @param currentPackageJson string | null current package.json file path
 * @param searchCooldown number cooldown time in milliseconds
 * @param lastSearchTime number timestamp of the last search
 * @returns Promise<{ results: any[], updatedLastSearchTime: number }>
 */
export async function performNpmSearch(searchTerm: string, currentPackageJson: string | null, searchCooldown: number, lastSearchTime: number): Promise<{ results: any[]; updatedLastSearchTime: number }> {
	const now = Date.now();
	const timeSinceLastSearch = now - lastSearchTime;

	if (timeSinceLastSearch < searchCooldown) {
		const remainingCooldown = Math.ceil((searchCooldown - timeSinceLastSearch) / 1000);
		throw new Error(`Please wait ${remainingCooldown} seconds before searching again to avoid rate limits.`);
	}

	if (!currentPackageJson) {
		throw new Error('No package.json selected. Please select a package.json file.');
	}

	const defaultRegistry = 'https://registry.npmjs.org/-/v1/search';
	const results = await searchNpmPackages(defaultRegistry, searchTerm);

	if (results.length === 0) {
		throw new Error(`No packages found for "${searchTerm}"`);
	}

	return { results, updatedLastSearchTime: now };
}

/**
 * Search for npm packages using the registry and term.
 *
 * @param registry string registry URL
 * @param term string search term
 * @returns Promise<{ name: string; description: string; version: string }[]>
 */
export async function searchNpmPackages(registry: string, term: string): Promise<{ name: string; description: string; version: string }[]> {
	const searchUrl = `${registry}/-/v1/search?text=${encodeURIComponent(term)}&size=20`;
	const response = await fetch(searchUrl, {
		headers: {
			'Accept': 'application/json',
			'User-Agent': 'vscode-yarn-extension'
		}
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch search results: ${response.statusText}`);
	}

	const data = (await response.json()) as { objects: any[] };
	return data.objects.map((obj) => ({
		name: obj.package.name,
		description: obj.package.description || 'No description available',
		version: obj.package.version
	}));
}
