import * as Fs from 'fs';
import * as Path from 'path';

import { workspace as Workspace } from 'vscode';

export function packageExists () {
    
    if (!Workspace.rootPath) {
        return false;
    }

    try {
        const filename = Path.join(Workspace.rootPath, 'package.json');
        const stat = Fs.statSync(filename);
        return stat && stat.isFile();
    }
    catch (ignored) {
        return false;
    }
};

