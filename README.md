<p align="center">
  <img src="https://raw.githubusercontent.com/gamunu/vscode-yarn/master/yarn_icon.png?raw=true" alt="vscode-yarn: VSCode extensions to manage yarn commands." width="150">
  <br>
  <a href="https://github.com/gamunu/vscode-yarn/releases/latest"><img src="https://img.shields.io/github/release/gamunu/vscode-yarn.png" alt="Releases"></a>
  <a href="https://code.visualstudio.com/updates/v1_19"><img src="https://img.shields.io/badge/VS_Code-v1.19+-373277.png"/></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=gamunu.vscode-yarn"><img src="https://img.shields.io/badge/Installs-5K%2B-brightgreen.png" alt="Installs"/></a>
  <a href="https://github.com/gamunu/vscode-yarn/issues"><img src="https://img.shields.io/github/issues/gamunu/vscode-yarn.png" alt="Issues"></a>
</p>
<p align="center">VSCode-Yarn: VSCode extensions to manage yarn commands.</p>

## Getting started

You can install this awesome extension through the [VSCode-Yarn](https://marketplace.visualstudio.com/items?itemName=gamunu.vscode-yarn).

### Installation

Launch *Quick Open*
  - <img src="https://www.kernel.org/theme/images/logos/favicon.png" width=16 height=16/> <a href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf">Linux</a> `Ctrl+P`
  - <img src="https://developer.apple.com/favicon.ico" width=16 height=16/> <a href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf">macOS</a> `⌘P`
  - <img src="https://www.microsoft.com/favicon.ico" width=16 height=16/> <a href="https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf">Windows</a> `Ctrl+P`

Paste the following command and press `Enter`:

```shell
ext install gamunu.vscode-yarn
```

#### Packaged VSIX Extension <sup>[↑](#getting-started)</sup>

[Download the latest .vsix release](https://github.com/gamunu/vscode-yarn/releases/latest) file from the GitHub repository and install it from the command line

```shell
code --install-extension vscode-yarn-*.*.*.vsix
```

or from within VS Code by launching *Quick Open* and running the *Install from VSIX...* command.

##### GitHub Repository Clone <sup>[↑](#getting-started)</sup>

Change to your `.vscode/extensions` [VS Code extensions directory](https://code.visualstudio.com/docs/extensions/install-extension#_side-loading).
Depending on your platform it is located in the following folders:

  - <img src="https://www.kernel.org/theme/images/logos/favicon.png" width=16 height=16/> **Linux** `~/.vscode/extensions`
  - <img src="https://developer.apple.com/favicon.ico" width=16 height=16/> **macOs** `~/.vscode/extensions`
  - <img src="https://www.microsoft.com/favicon.ico" width=16 height=16/> **Windows** `%USERPROFILE%\.vscode\extensions`

Clone the VSCode Yarn repository as `gamunu.vscode-yarn`:

```shell
git clone git@github.com:gamunu/vscode-yarn.git gamunu.vscode-yarn
```
## Features

### Commands

* `yarn init` - Initialize a new yarn package
* `yarn install` - Install all dependencies for a project
* `yarn add` - Add a package to use in your current package
* `yarn add --dev` - Add a package to the "devDependencies"
* `yarn remove <pkg>` - Remove a package
* `yarn start` - Run the "start" script defined in package.json
* `yarn test` - Run the "test" script defined in package.json
* `yarn build` - Run the "build" script defined in package.json
* `yarn publish [tag]` - Publish a package to npm registry with optional tag
* `yarn run <script>` - Run a defined package script
* `Search Packages` - Search npm registry for packages with interactive installation
* `Manage Registries` - Add/remove custom npm registries for package search

Not happy with the available commands? No problem, `raw command` is also available. Enter any yarn command you want.

### Explorer context menu

Yarn commands are available in the `package.json` file's explorer context menu for quick access.

![Context menu](images/context.png)

### Yarn Sidebar

The extension provides a dedicated sidebar in VS Code's activity bar for comprehensive yarn management:

![Yarn Sidebar](https://raw.githubusercontent.com/gamunu/vscode-yarn/master/images/yarn-sidebar.png)

#### Search Packages View

The Search Packages view allows you to:

- **Search for npm packages**: Enter a search term to find packages in the npm registry
- **View search results directly**: See package names, descriptions, and versions
- **Install with one click**: Install as regular or dev dependency with convenient buttons
- **Rate limit protection**: Built-in cooldown system to avoid npm registry rate limits

To search for packages:
1. Click the Search icon in the sidebar title
2. Enter your search term
3. Press Enter to see results
4. Use the inline buttons to install packages

#### Dependencies View

The Dependencies view provides:

- **Visual organization**: Dependencies and DevDependencies in separate collapsible sections
- **Version information**: See installed versions at a glance
- **Quick uninstall**: Remove packages with one click
- **Auto-refresh**: Automatically updates when dependencies change

This view makes it easy to:
- Monitor what packages are installed in your project
- Quickly remove unnecessary dependencies
- Distinguish between regular and development dependencies

### TouchBar support

Support for Macbook Pro Touch Bar. Following yarn commands are available:

- yarn install
- yarn start
- yarn test
- yarn build

![touch bar support](images/touchbar.png)

### Run last executed script

You can also run the last executed script by typing `yarn run last...`.

### Terminate a script

You can terminate a script with the `terminate` command. It uses the `tree-kill` module that you can find on `yarn`.
It has different behaviors on Unix or Windows.

### Multi-workspace support

The extension fully supports multi-root workspaces:

- Choose which package.json to work with when multiple are available
- Remember your selection for subsequent operations
- Switch between different package.json files easily

### Order of execution of yarn commands

01. If a package.json is opened as an active editor/focused tab yarn will be invoked on it.
02. If the package.json is explicitly defined in the configuration yarn will invoke on it.
03. If above scenarios fail to satisfy. The extension will fallback to package.json in project root folder.

### Package search and custom registries

The extension offers an enhanced package search experience:

#### Searching for packages

There are multiple ways to search for packages:

1. **Via Command Palette**:
   - Open the command palette (Ctrl+Shift+P or Cmd+Shift+P on macOS)
   - Type "Yarn: Search Packages"
   - Enter your search term
   - Select a package to install

2. **Via Yarn Sidebar**:
   - Click the Yarn icon in the activity bar
   - Click the search icon in the sidebar title bar
   - Enter your search term
   - Use the inline buttons to install packages

3. **With Quick Pick**:
   - When searching, you can choose to install as regular or dev dependency
   - The quick pick shows package descriptions and versions

## Settings

- `yarn.runInTerminal` Defines whether the command is run in a terminal window or whether the output form the command is shown in the `Output` window. The default is to show the output in the output window.
- `yarn.dontHideOutputOnSuccess` Keep the output panel visible when yarn execution is successful. No effect with runInTerminal. The default is to keep output window open.
- `yarn.bin` Custom yarn bin name, the default is `yarn`.
- `yarn.packageJson` Default package json path. relative to current project root.
- `yarn.enableTouchbar` Enable TouchBar support in MacOSX. TouchBar support includes:
   - yarn install
   - yarn run build
   - yarn run test
   - yarn run start

##### Example
```javascript
{
  "yarn.runInTerminal": false,
  "yarn.dontHideOutputOnSuccess": false,
  "yarn.packageJson": "src/package.json"
}
```

## Keyboard Shortcuts

The extension defines a chording keyboard shortcut for the `R` key. As a consequence an existing keybinding for `R` is not executed immediately. If this is not desired, then please bind another key for these commands, see the [customization](https://code.visualstudio.com/docs/customization/keybindings) documentation.

| Shortcut (Windows/Linux) | Shortcut (macOS) | Command |
|--------------------------|------------------|---------|
| `Ctrl+R Shift+R`         | `Cmd+R Shift+R`  | Run Script |
| `Ctrl+R R`               | `Cmd+R R`        | Run Last Script |
| `Ctrl+R Shift+X`         | `Cmd+R Shift+X`  | Terminate Script |
| `Ctrl+R T`               | `Cmd+R T`        | Run Test |

## Contribute

Report a bug or a suggestion by posting an issue on the [GitHub repository](https://github.com/gamunu/vscode-yarn).

vscode-yarn incorporates code modified from [fknop vscode-npm](https://github.com/fknop/vscode-npm).
