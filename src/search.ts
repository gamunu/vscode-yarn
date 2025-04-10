import { window as Window, Uri, commands as Commands } from 'vscode';
import { getPackageJson } from './utils';
import * as fetch from 'node-fetch';

export interface PackageInfo {
    name: string;
    description: string;
    version: string;
}

/**
 * Refresh the sidebar view
 */
export function refreshSidebar(): void {
    Commands.executeCommand('yarn-script.refreshSidebar');
}

/**
 * Search npm packages from the registry
 * This will now show a quick pick for searching npm packages
 *
 * @param arg path to the file where command originated
 * @returns void
 */
export async function yarnSearchPackages(arg: Uri) {
    const packageJson: string = await getPackageJson(arg);

    if (packageJson === null) { return; }

    // Show a quick pick for searching npm packages
    const quickPick = Window.createQuickPick();
    quickPick.placeholder = 'Search for npm packages';
    quickPick.onDidChangeValue(async (value) => {
        if (value.length > 2) {
            quickPick.busy = true;
            try {
                const results = await searchNpmPackages('https://registry.npmjs.org', value);
                quickPick.items = results.map(pkg => ({
                    label: pkg.name,
                    description: pkg.description,
                    detail: `Version: ${pkg.version}`
                }));
            } catch (error) {
                quickPick.items = [{ label: 'Error fetching results', description: error.message }];
            } finally {
                quickPick.busy = false;
            }
        }
    });
    quickPick.onDidAccept(() => {
        const selectedItem = quickPick.selectedItems[0];
        if (selectedItem) {
            Commands.executeCommand('yarn-script.installPackageWithQuickPick', {
                label: selectedItem.label
            });
        }
        quickPick.hide();
    });
    quickPick.show();
}

/**
 * Search for npm packages from a registry
 *
 * @param registry URL of the registry
 * @param term search term
 * @returns Promise<PackageInfo[]> array of package information
 */
export async function searchNpmPackages(registry: string, term: string): Promise<PackageInfo[]> {
    try {
        // Prepare search URL
        const searchUrl = registry.endsWith('search')
            ? `${registry}?text=${encodeURIComponent(term)}&size=20`
            : `${registry}/-/v1/search?text=${encodeURIComponent(term)}&size=20`;

        // Fetch data from npm registry with retry logic
        let retryCount = 0;
        const maxRetries = 3;
        const baseDelay = 1000; // 1 second

        while (retryCount < maxRetries) {
            try {
                const response = await fetch.default(searchUrl, {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'vscode-yarn-extension'
                    }
                });

                if (response.status === 429) {
                    // Rate limited - wait and retry
                    const delay = baseDelay * Math.pow(2, retryCount);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retryCount++;
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`Registry search failed: ${response.statusText}`);
                }

                const data = await response.json();

                // Parse the response
                if (data && data.objects && Array.isArray(data.objects)) {
                    return data.objects.map((obj: any) => ({
                        name: obj.package.name,
                        description: obj.package.description || 'No description available',
                        version: obj.package.version
                    }));
                } else if (data && data.results && Array.isArray(data.results)) {
                    // Handle alternative registry response format
                    return data.results.map((pkg: any) => ({
                        name: pkg.name,
                        description: pkg.description || 'No description available',
                        version: pkg.version
                    }));
                }

                return [];
            } catch (error) {
                // If this is our last retry, throw the error
                if (retryCount >= maxRetries - 1) {
                    throw error;
                }

                // Otherwise wait and retry
                const delay = baseDelay * Math.pow(2, retryCount);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
            }
        }

        // We should never reach here due to the throw in the last retry
        return [];
    } catch (error) {
        console.error('Error searching npm registry:', error);
        throw error;
    }
}