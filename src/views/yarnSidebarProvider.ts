import * as vscode from 'vscode';
import { searchNpmPackages } from '../search';
import { getInstalledDependencies, pickPackageJson } from '../utils';
import { runCommand } from '../run-command';
import * as Messages from '../messages';

/**
 * Tree data provider for the search packages sidebar
 */
export class YarnSearchProvider implements vscode.TreeDataProvider<YarnTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<YarnTreeItem | undefined | null | void> = new vscode.EventEmitter<YarnTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<YarnTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private _searchResults: any[] = [];
    public _currentPackageJson: string | null = null;
    private _searchTerm: string = '';
    private _lastSearchTime: number = 0;
    private _searchCooldown: number = 3000; // 3 seconds cooldown between searches
    public searchInputBox: vscode.InputBox | undefined;
    private _view: vscode.TreeView<YarnTreeItem> | undefined;

    constructor() { }

    setTreeView(view: vscode.TreeView<YarnTreeItem>) {
        this._view = view;
        this._setupSearchBox();

        // Ensure the search box is hidden initially
        this._hideSearchBox();
    }

    private _setupSearchBox() {
        if (!this._view) {
            return;
        }

        // Create search input box in the title of the view
        this.searchInputBox = vscode.window.createInputBox();
        this.searchInputBox.placeholder = 'Search npm packages...';
        this.searchInputBox.prompt = 'Type to search for npm packages';

        // Hide it initially as we'll show it in the title
        this.searchInputBox.hide();

        // Handle search on Enter key
        this.searchInputBox.onDidAccept(async () => {
            const searchTerm = this.searchInputBox?.value;
            if (searchTerm && searchTerm.trim()) {
                await this.performSearch(searchTerm);
                // Keep the input box visible after search
                if (this._view?.visible) {
                    this._showSearchBox();
                }
            }
        });

        // Set the title of the view to include the search box
        this._view.title = "Search Packages";

        // Don't automatically show search box when view becomes visible
        // Only show it when explicitly requested
        this._view.onDidChangeVisibility(e => {
            if (!e.visible) {
                this.searchInputBox?.hide();
            }
        });
    }

    public _showSearchBox() {
        if (this.searchInputBox) {
            this.searchInputBox.show();
        }
    }

    private _hideSearchBox() {
        if (this.searchInputBox) {
            this.searchInputBox.hide();
        }
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    async performSearch(searchTerm: string): Promise<void> {
        const now = Date.now();
        const timeSinceLastSearch = now - this._lastSearchTime;

        // Check if we're within the cooldown period
        if (timeSinceLastSearch < this._searchCooldown) {
            const remainingCooldown = Math.ceil((this._searchCooldown - timeSinceLastSearch) / 1000);
            vscode.window.showInformationMessage(
                `Please wait ${remainingCooldown} seconds before searching again to avoid rate limits.`
            );
            return;
        }

        // Update search tracking variables
        this._searchTerm = searchTerm;
        this._lastSearchTime = now;

        // Get current package.json
        if (!this._currentPackageJson) {
            this._currentPackageJson = await pickPackageJson();
            if (!this._currentPackageJson) {
                Messages.noPackageError();
                return;
            }
        }

        try {
            // Show progress notification
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: `Searching for "${searchTerm}"...`,
                cancellable: true
            }, async () => {
                const defaultRegistry = 'https://registry.npmjs.org/-/v1/search';

                // Perform the search
                try {
                    this._searchResults = await searchNpmPackages(defaultRegistry, searchTerm);

                    if (this._searchResults.length === 0) {
                        vscode.window.showInformationMessage(`No packages found for "${searchTerm}"`);
                    }

                    this.refresh();
                } catch (error) {
                    // If search fails, clear results and show error
                    this._searchResults = [];
                    throw error;
                }
            });
        } catch (error) {
            Messages.searchError(error.message);
        }
    }

    async initializePackageJson(): Promise<void> {
        if (!this._currentPackageJson) {
            this._currentPackageJson = await pickPackageJson();
            if (!this._currentPackageJson) {
                Messages.noPackageError();
                return;
            }
        }
        this.refresh();
    }

    getTreeItem(element: YarnTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: YarnTreeItem): Thenable<YarnTreeItem[]> {
        if (!element) {
            if (this._searchResults.length > 0) {
                // Return search results
                return Promise.resolve(
                    this._searchResults.map(pkg => this._createPackageTreeItem(pkg))
                );
            } else {
                // Empty state
                return Promise.resolve([]);
            }
        }
        return Promise.resolve([]);
    }

    private _createPackageTreeItem(pkg: any): YarnTreeItem {
        let contextValue = 'package';
        let description = pkg.version;
        let installed = false;

        // Check if package is already installed
        if (this._currentPackageJson) {
            const { dependencies, devDependencies } = getInstalledDependencies(this._currentPackageJson);

            if (dependencies[pkg.name]) {
                contextValue = 'installed-package';
                description = `${pkg.version} (installed)`;
                installed = true;
            } else if (devDependencies[pkg.name]) {
                contextValue = 'installed-dev-package';
                description = `${pkg.version} (installed-dev)`;
                installed = true;
            }
        }

        return new YarnTreeItem(
            pkg.name,
            description,
            vscode.TreeItemCollapsibleState.None,
            undefined,
            contextValue,
            pkg.description || 'No description available',
            installed ? 'package-installed' : 'package-not-installed'
        );
    }
}

/**
 * Tree data provider for the dependencies sidebar
 */
export class YarnDependenciesProvider implements vscode.TreeDataProvider<YarnTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<YarnTreeItem | undefined | null | void> = new vscode.EventEmitter<YarnTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<YarnTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    public _currentPackageJson: string | null = null;
    private _packageJsonWatcher: vscode.FileSystemWatcher | undefined;

    constructor() {
        this._initPackageJsonWatcher();
    }

    private _initPackageJsonWatcher(): void {
        // Watch for package.json changes to auto-refresh the dependencies view
        this._packageJsonWatcher = vscode.workspace.createFileSystemWatcher('**/package.json');

        this._packageJsonWatcher.onDidChange(() => {
            if (this._currentPackageJson) {
                this.refresh();
            }
        });

        this._packageJsonWatcher.onDidCreate(() => {
            this.refresh();
        });

        this._packageJsonWatcher.onDidDelete(() => {
            if (this._currentPackageJson) {
                this._currentPackageJson = null;
                this.refresh();
            }
        });
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    public refreshDependencies(): void {
        this.refresh();
    }

    async initializePackageJson(): Promise<void> {
        this._currentPackageJson = await pickPackageJson();
        this.refresh();
    }

    getTreeItem(element: YarnTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: YarnTreeItem): Thenable<YarnTreeItem[]> {
        if (!element) {
            // Root level items - show dependencies categories
            if (!this._currentPackageJson) {
                return Promise.resolve([
                    new YarnTreeItem(
                        'No package.json found',
                        'Click to select package.json',
                        vscode.TreeItemCollapsibleState.None,
                        {
                            command: 'yarn-script.refreshSidebar',
                            title: 'Select package.json',
                            arguments: []
                        },
                        'no-package-json',
                        'Select a package.json file',
                        'info-icon'
                    )
                ]);
            }

            // Create categories for regular and dev dependencies
            const dependenciesCategories = [
                new YarnTreeItem(
                    'Dependencies',
                    'Regular dependencies',
                    vscode.TreeItemCollapsibleState.Collapsed,
                    undefined,
                    'dependencies-category',
                    'Regular dependencies used in production',
                    'folder-icon'
                ),
                new YarnTreeItem(
                    'Dev Dependencies',
                    'Development dependencies',
                    vscode.TreeItemCollapsibleState.Collapsed,
                    undefined,
                    'dev-dependencies-category',
                    'Dependencies used only during development',
                    'folder-icon'
                )
            ];

            return Promise.resolve(dependenciesCategories);
        } else if (element.contextValue === 'dependencies-category' && this._currentPackageJson) {
            // Show regular dependencies
            const { dependencies } = getInstalledDependencies(this._currentPackageJson);
            const depItems = Object.keys(dependencies).map(dep => {
                return new YarnTreeItem(
                    dep,
                    dependencies[dep],
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    'installed-package',
                    `${dep}@${dependencies[dep]}`,
                    'package-installed'
                );
            });

            if (depItems.length === 0) {
                return Promise.resolve([
                    new YarnTreeItem(
                        'No dependencies installed',
                        '',
                        vscode.TreeItemCollapsibleState.None,
                        undefined,
                        'empty-dependencies',
                        'No regular dependencies have been installed',
                        'info-icon'
                    )
                ]);
            }

            return Promise.resolve(depItems);
        } else if (element.contextValue === 'dev-dependencies-category' && this._currentPackageJson) {
            // Show dev dependencies
            const { devDependencies } = getInstalledDependencies(this._currentPackageJson);
            const devDepItems = Object.keys(devDependencies).map(dep => {
                return new YarnTreeItem(
                    dep,
                    devDependencies[dep],
                    vscode.TreeItemCollapsibleState.None,
                    undefined,
                    'installed-dev-package',
                    `${dep}@${devDependencies[dep]}`,
                    'package-installed'
                );
            });

            if (devDepItems.length === 0) {
                return Promise.resolve([
                    new YarnTreeItem(
                        'No dev dependencies installed',
                        '',
                        vscode.TreeItemCollapsibleState.None,
                        undefined,
                        'empty-dev-dependencies',
                        'No development dependencies have been installed',
                        'info-icon'
                    )
                ]);
            }

            return Promise.resolve(devDepItems);
        }

        return Promise.resolve([]);
    }

    dispose() {
        if (this._packageJsonWatcher) {
            this._packageJsonWatcher.dispose();
        }
    }
}

/**
 * Tree item implementation for Yarn-related items
 */
export class YarnTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command,
        public readonly contextValue?: string,
        public readonly tooltipText?: string,
        public readonly iconName?: string
    ) {
        super(label, collapsibleState);
        this.description = description;
        this.contextValue = contextValue;
        this.tooltip = tooltipText || description;

        // Set icons based on context value or explicit icon name
        if (iconName === 'package-installed') {
            this.iconPath = new vscode.ThemeIcon('package');
        } else if (iconName === 'package-not-installed') {
            this.iconPath = new vscode.ThemeIcon('package');
        } else if (iconName === 'search-icon' || contextValue === 'search-box') {
            this.iconPath = new vscode.ThemeIcon('search');
        } else if (iconName === 'packages-icon' || contextValue === 'installed-packages-section') {
            this.iconPath = new vscode.ThemeIcon('package');
        } else if (iconName === 'search-results-icon' || contextValue === 'search-results-section') {
            this.iconPath = new vscode.ThemeIcon('list-tree');
        } else if (iconName === 'folder-icon') {
            this.iconPath = new vscode.ThemeIcon('folder');
        } else if (iconName === 'info-icon') {
            this.iconPath = new vscode.ThemeIcon('info');
        } else if (iconName === 'dev-dependency-icon') {
            this.iconPath = new vscode.ThemeIcon('tools'); // Icon for dev dependencies
        } else if (iconName === 'dependency-icon') {
            this.iconPath = new vscode.ThemeIcon('dependency'); // Icon for regular dependencies
        }
    }
}

/**
 * Function to get a random nonce string
 */
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/**
 * Register all sidebar views and commands
 */
export function registerYarnSidebar(context: vscode.ExtensionContext) {
    // Create providers
    const searchProvider = new YarnSearchProvider();
    const dependenciesProvider = new YarnDependenciesProvider();

    // Register tree data providers
    const searchTreeView = vscode.window.createTreeView('yarnSidebar', {
        treeDataProvider: searchProvider,
        showCollapseAll: false
    });
    searchProvider.setTreeView(searchTreeView);

    const dependenciesTreeView = vscode.window.createTreeView('package-dependencies', {
        treeDataProvider: dependenciesProvider,
        showCollapseAll: true
    });

    // Initialize package.json for both providers
    searchProvider.initializePackageJson();
    dependenciesProvider.initializePackageJson();

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('yarn-script.refreshSidebar', async () => {
            // Pick package.json for both providers
            const packageJsonPath = await pickPackageJson();
            if (packageJsonPath) {
                searchProvider._currentPackageJson = packageJsonPath;
                dependenciesProvider._currentPackageJson = packageJsonPath;

                // Refresh both views
                searchProvider.refresh();
                dependenciesProvider.refresh();
            }
        }),

        vscode.commands.registerCommand('yarn-script.searchInSidebar', async () => {
            // Show the search input box
            searchProvider._showSearchBox();
        }),

        vscode.commands.registerCommand('yarn-script.installPackageFromSidebar', async (item: YarnTreeItem) => {
            if (!item || !searchProvider._currentPackageJson) {
                Messages.noPackageError();
                return;
            }

            // Confirm installation
            const confirmation = await vscode.window.showInformationMessage(
                `Install package '${item.label}'?`,
                'Yes', 'No'
            );

            if (confirmation === 'Yes') {
                // Run yarn add command
                runCommand(['add', item.label], searchProvider._currentPackageJson);

                // Refresh both sidebars after a delay to show updated state
                setTimeout(() => {
                    searchProvider.refresh();
                    dependenciesProvider.refresh();
                }, 2000);
            }
        }),

        vscode.commands.registerCommand('yarn-script.installDevPackageFromSidebar', async (item: YarnTreeItem) => {
            if (!item || !searchProvider._currentPackageJson) {
                Messages.noPackageError();
                return;
            }

            // Confirm installation
            const confirmation = await vscode.window.showInformationMessage(
                `Install '${item.label}' as dev dependency?`,
                'Yes', 'No'
            );

            if (confirmation === 'Yes') {
                // Run yarn add --dev command
                runCommand(['add', item.label, '--dev'], searchProvider._currentPackageJson);

                // Refresh both sidebars after a delay to show updated state
                setTimeout(() => {
                    searchProvider.refresh();
                    dependenciesProvider.refresh();
                }, 2000);
            }
        }),

        vscode.commands.registerCommand('yarn-script.uninstallPackageFromSidebar', async (item: YarnTreeItem) => {
            const packageJson = searchProvider._currentPackageJson || dependenciesProvider._currentPackageJson;

            if (!item || !packageJson) {
                Messages.noPackageError();
                return;
            }

            const confirmation = await vscode.window.showWarningMessage(
                `Are you sure you want to remove package '${item.label}'?`,
                { modal: true },
                'Yes',
                'No'
            );

            if (confirmation === 'Yes') {
                // Run yarn remove command
                runCommand(['remove', item.label], packageJson);

                // Refresh both sidebars after a delay to show updated state
                setTimeout(() => {
                    searchProvider.refresh();
                    dependenciesProvider.refresh();
                }, 2000);
            }
        }),

        vscode.commands.registerCommand('yarn-script.installPackageWithQuickPick', async (item: YarnTreeItem) => {
            if (!item || !searchProvider._currentPackageJson) {
                Messages.noPackageError();
                return;
            }

            const dependencyType = await vscode.window.showQuickPick(['Regular Dependency', 'Dev Dependency'], {
                placeHolder: 'Select dependency type',
            });

            if (dependencyType) {
                const commandArgs = dependencyType === 'Dev Dependency' ? ['add', item.label, '--dev'] : ['add', item.label];
                runCommand(commandArgs, searchProvider._currentPackageJson);

                // Refresh both sidebars after a delay to show updated state
                setTimeout(() => {
                    searchProvider.refresh();
                    dependenciesProvider.refresh();
                }, 2000);
            }
        }),

        vscode.commands.registerCommand('yarn-script.uninstallPackageWithQuickPick', async (item: YarnTreeItem) => {
            const packageJson = searchProvider._currentPackageJson || dependenciesProvider._currentPackageJson;

            if (!item || !packageJson) {
                Messages.noPackageError();
                return;
            }

            const dependencyType = await vscode.window.showQuickPick(['Regular Dependency', 'Dev Dependency'], {
                placeHolder: 'Select dependency type to uninstall',
            });

            if (dependencyType) {
                const commandArgs = ['remove', item.label];
                runCommand(commandArgs, packageJson);

                // Refresh both sidebars after a delay to show updated state
                setTimeout(() => {
                    searchProvider.refresh();
                    dependenciesProvider.refresh();
                }, 2000);
            }
        }),

        // Dispose providers when extension is deactivated
        { dispose: () => dependenciesProvider.dispose() },
        searchTreeView,
        dependenciesTreeView
    );
}
