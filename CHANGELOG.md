## 2.1.0 - 21st of February, 2022

* Add Explorer context menu submenus for additional Yarn commands.
`Install Packages`, `Test`, `Build`, `Start`, `Run Script`, `Add & Save Package`, `Add & Save Dev Package`, `Remove Package`, `Publish`, `Outdated`

## 2.0.0 - 07th of August, 2021

* Add WSL support
* Add Multi-Workspace support

## 1.7.0 - 08th of December, 2019

* Fix for [Issue 11](https://github.com/gamunu/vscode-yarn/issues/11)
* Add touchbar assets and update package.json.
touchbar support includes:
   - yarn run test
   - yarn install
   - yarn run build
   - yarn run start
* New workspace setting `config.yarn.enableTouchbar` to
enable touchbar support.
* `run.runInTerminal` is now default to true.
* Add typings for tree-kill package
* Add new line before EOF in all ts files.
* Add webpack package build

## 1.6 - 26th February, 2018

* Fix for [Issue 9](https://github.com/gamunu/vscode-yarn/issues/9)
* Fix for [Issue 8](https://github.com/gamunu/vscode-yarn/issues/8)
* Fixed the bug context menu not correctly picking up the package.json file

## 1.5 - 03rd February, 2018

* Explorer context menu for installing packages.
* Default behavior changed to keep the output window open after executing a command. yarn.dontHideOutputOnSuccess (default true)
* Fix for [Issue 7](https://github.com/gamunu/vscode-yarn/issues/7)

## 1.4.0 - 12th November, 2017

* New workspace settings
  * yarn.dontHideOutputOnSuccess (default false) Keep the output panel visible when yarn execution is successful (no effect with runInTerminal)

## 1.3.0 - 11th September, 2017

* New workspace settings
  * yarn.packageJson (default "") specify a default package json file path. relative to current project root.

## 1.2.0 - 11th May, 2017

* Two new workspace settings
  * yarn.runInTerminal (default false), this will execute commands in a terminal window.
  * yarn.bin (default env Yarn bin path), this can be used to set a custom Yarn location.

## 1.1.0 - 12th April, 2017

* Changed yarn commands execution behavior,
Fix for [Issue 1](https://github.com/gamunu/vscode-yarn/issues/1)

01. If a package.json is opened as an active editor yarn will be invoked on it.
02. If the above scenario fails to satisfy fallback to package.json in project root folder.