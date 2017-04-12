VSCode extensions to manage yarn commands.

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

## Contribute

Report a bug or a suggestion by posting an issue on the git repository (https://github.com/gamunu/vscode-yarn).

vscode-yarn incorporates code modified from [fknop vscode-npm](https://github.com/fknop/vscode-npm).