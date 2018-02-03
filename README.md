<p align="center">
  <img src="https://raw.githubusercontent.com/gamunu/vscode-yarn/master/yarn_icon.png?raw=true" alt="vscode-yarn: VSCode extensions to manage yarn commands." width="150">
  <br>
  <a href="https://github.com/gamunu/vscode-yarn/releases/latest"><img src="https://img.shields.io/github/release/gamunu/vscode-yarn.svg" alt="Releases"></a>
  <a href="https://github.com/gamunu/vscode-yarn/issues"><img src="https://img.shields.io/github/issues/gamunu/vscode-yarn.svg" alt="Issues"></a>
</p>
<p align="center">VSCode-Yarn: VSCode extensions to manage yarn commands.</p>

## Commands available

* `yarn init`
* `yarn install`
* `yarn add`
* `yarn add --dev`
* `yarn remove <pkg>`
* `yarn start`
* `yarn test`
* `yarn publish [tag]`
* `yarn run <script>`

Not happy with the available commands ? No problem, raw command is also available. Enter any yarn command you want.

##Explorer context menu

Run npm install, also available in the context menu of the explorer when the `package.json file

## Run last executed script

You can also run the last executed script by typing `yarn run last...`.

## Terminate a script

You can terminate a script with the `terminate` command. It uses the `tree-kill` module that you can find on `yarn`.
It has different behaviors on Unix or Windows. 

## Order of execution of yarn commands

01. If a package.json is opened as an active editor/focused tab yarn will be invoked on it.
02. If the package.json is explicitly defined in the configuration yarn will invoke on it.
02. If above scenarios fail to satisfy. The extension will fallback to package.json in project root folder.

## Settings

- `yarn.runInTerminal` defines whether the command is run in a terminal window or whether the output form the command is shown in the `Output` window. The default is to show the output in the output window.
- `yarn.dontHideOutputOnSuccess` Keep the output panel visible when yarn execution is successful. No effect with runInTerminal. The default is to keep output window open.
- `yarn.bin` custom npm bin name, the default is `yarn`.
- `yarn.packageJson` default package json path. relative to current project root

##### Example
```javascript
{
  "yarn.runInTerminal": false,
  "yarn.dontHideOutputOnSuccess": false
  "yarn.packageJson": "src/package.json"
}
```

## Keyboard Shortcuts

The extension defines a chording keyboard shortcut for the `R` key. As a consequence an existing keybinding for `R` is not executed immediately. If this is not desired, then please bind another key for these commands, see the [customization](https://code.visualstudio.com/docs/customization/keybindings) documentation.

## Contribute

Report a bug or a suggestion by posting an issue on the git repository (https://github.com/gamunu/vscode-yarn).

vscode-yarn incorporates code modified from [fknop vscode-npm](https://github.com/fknop/vscode-npm).