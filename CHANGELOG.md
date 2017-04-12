## 1.1.0 - 12th April, 2017

* Changed yarn execution behavior,
Fix for [Issue 1](https://github.com/gamunu/vscode-yarn/issues/1)

01. If a package.json is opened as an active editor yarn will be invoked on it.
02. If the above scenario fails to satisfy fallback to package.json in project root folder.