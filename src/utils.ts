import * as Fs from 'fs';
import * as Path from 'path';
import { workspace as Workspace, window } from 'vscode';

export function packageExists() {
    if (!Workspace.rootPath) {
        return false;
    }

    let filename = Path.join(Workspace.rootPath, 'package.json');
    let confPackagejson = Workspace.getConfiguration('yarn')['packageJson']

    if (confPackagejson) {
        filename = Path.join(Workspace.rootPath, confPackagejson)
    }

    let editor = window.activeTextEditor;
    if (editor && editor.document.fileName.endsWith("package.json")) {
        filename = editor.document.fileName;
    }

    try {
        const stat = Fs.statSync(filename);
        return stat && stat.isFile();
    }
    catch (ignored) {
        return false;
    }
};

export function useTerminal() {
    return Workspace.getConfiguration('yarn')['runInTerminal'];
}

export function getYarnBin() {
    return Workspace.getConfiguration('yarn')['bin'] || 'yarn';
}

export function dontHideOutputOnSuccess() {
    return Workspace.getConfiguration('yarn')['dontHideOutputOnSuccess'];
}