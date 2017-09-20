import { ChildProcess, exec } from 'child_process';
import { workspace as Workspace, ViewColumn, window, Terminal } from 'vscode';
import { outputChannel } from './output';
import { runInTerminal, Options } from 'run-in-terminal';
import { useTerminal, getYarnBin } from './utils'
import * as Path from 'path';

const kill = require('tree-kill');
export let terminal: Terminal = null;

export interface ChildCommand {
    child: ChildProcess,
    cmd: string,
    killedByUs?: boolean
}

export const childs: Map<number, ChildCommand> = new Map();

export function terminate(pid) {
    const childCommand = childs.get(pid);
    if (childCommand.child) {
        outputChannel.appendLine('');
        outputChannel.appendLine(`Killing process: ${childCommand.cmd} (pid:${pid})`);
        outputChannel.appendLine('');
        childCommand.killedByUs = true;
        kill(pid, 'SIGTERM');
    }
}

export function runCommand(args: string[]) {
    let cwd = Workspace.rootPath

    let confPackagejson = Workspace.getConfiguration('yarn')['packageJson']
    
    if (confPackagejson) {
        cwd =  Path.join(Workspace.rootPath, confPackagejson).replace(/package.json$/i, "");
    }

    let editor = window.activeTextEditor;
    if (editor && editor.document.fileName.endsWith("package.json")) {
        cwd = editor.document.fileName.replace(/package.json$/i, "");
    }

    const options = {
        cwd: cwd,
        env: process.env
    }

    if (useTerminal()) {
        if (typeof window.createTerminal == 'function') {
            runCommandInIntegratedTerminal(args, cwd)
        } else {
            runCommandInTerminal(args, options);
        }
    } else {
        runCommandInOutputWindow(args, cwd);
    }
};

function runCommandInTerminal(args: string[], options?: Options): void {
    runInTerminal(getYarnBin(), args, options);
}

function runCommandInIntegratedTerminal(args: string[], cwd: string): void {
    const cmd_args = Array.from(args);
    if (!terminal) {
        terminal = window.createTerminal('Yarn');
    }
    terminal.show();
    if (cwd) {
        // Replace single backslash with double backslash.
        const textCwd = cwd.replace(/\\/g, '\\\\');
        terminal.sendText(['cd', `"${textCwd}"`].join(' '));
    }
    cmd_args.splice(0, 0, getYarnBin());
    terminal.sendText(cmd_args.join(' '));
}

function runCommandInOutputWindow(args: string[], cwd: string) {
    const cmd = getYarnBin() + ' ' + args.join(' ');

    const child = exec(cmd, { cwd: cwd, env: process.env });

    childs.set(child.pid, { child: child, cmd: cmd });

    child.on('exit', (code, signal) => {

        if (signal === 'SIGTERM' || childs.get(child.pid).killedByUs) {
            outputChannel.appendLine('');
            outputChannel.appendLine('Successfully killed process');
            outputChannel.appendLine('');
            outputChannel.appendLine('--------------------')
            outputChannel.appendLine('');
        }

        if (code === 0) {
            outputChannel.appendLine('');
            outputChannel.appendLine('--------------------')
            outputChannel.appendLine('');
            outputChannel.hide();
        }

        childs.delete(child.pid);
    });

    outputChannel.appendLine(cmd);
    outputChannel.appendLine('');

    const append = function (data) {

        outputChannel.append(data);
    };

    child.stderr.on('data', append);
    child.stdout.on('data', append);
    outputChannel.show(ViewColumn.Three);
}