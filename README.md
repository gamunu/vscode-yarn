<p align="center">
  <img src="yarn_icon.png?raw=true" alt="vscode-yarn: VSCode extensions to manage yarn commands." width="150">
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

## Run last executed script

You can also run the last executed script by typing `yarn run last...`.

## Terminate a script

You can terminate a script with the `terminate` command. It uses the `tree-kill` module that you can find on `yarn`.
It has different behaviors on Unix or Windows. 

## Order of execution of yarn commands

01. If a package.json is opened as an active editor/focused tab yarn will be invoked on it.
02. If the above scenario fails to satisfy it will fallback to package.json in project root folder.

## Settings
- `yarn.runInTerminal` defines whether the command is run
in a terminal window or whether the output form the command is shown in the `Output` window. The default is to show the output in the terminal.
- `yarn.bin` custom npm bin name, the default is `yarn`.

##### Example
```javascript
{
	"yarn.runInTerminal": false
}
```

## Contribute

Report a bug or a suggestion by posting an issue on the git repository (https://github.com/gamunu/vscode-yarn).

vscode-yarn incorporates code modified from [fknop vscode-npm](https://github.com/fknop/vscode-npm).