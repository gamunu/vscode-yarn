import * as Fs from 'fs';
import { window as Window, Uri, QuickPickItem } from 'vscode';
import * as Messages from './messages';
import { runCommand } from './run-command';
import { packageExists, getPackageJson } from './utils';

let lastScript: {
	packageJson: string;
	script: string;
};

/**
 * Read scripts from package.json file
 *
 * @param arg path to the file where command orignated
 * @returns void
 */
export async function yarnRunScript(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	const scripts = readScripts(packageJson);
	if (!scripts) {
		return;
	}

	const items: QuickPickItem[] = Object.keys(scripts).map((key) => {
		return { label: key, description: scripts[key] };
	});

	Window.showQuickPick(items).then((value) => {
		lastScript = {
			packageJson: packageJson,
			script: value.label
		};
		runCommand(['run', value.label], packageJson);
	});
}

/**
 * Read scripts from package.json file
 *
 * @param arg path to the file where command orignated
 * @returns void
 */
export async function yarnTest(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	const scripts = readScripts(packageJson);
	if (!scripts) {
		return;
	}

	if (!scripts.test) {
		Messages.noTestScript();
		return;
	}

	lastScript = {
		packageJson: packageJson,
		script: 'test'
	};
	runCommand(['run', 'test'], packageJson);
}

export async function yarnStart(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	const scripts = readScripts(packageJson);
	if (!scripts) {
		return;
	}

	if (!scripts.start) {
		Messages.noStartScript();
		return;
	}

	lastScript = {
		packageJson: packageJson,
		script: 'start'
	};
	runCommand(['run', 'start'], packageJson);
}

export async function yarnBuild(arg: Uri) {
	const packageJson: string = await getPackageJson(arg);

	if (packageJson === null) { return; }

	const scripts = readScripts(packageJson);
	if (!scripts) {
		return;
	}

	if (!scripts.build) {
		Messages.noBuildScript();
		return;
	}

	lastScript = {
		packageJson: packageJson,
		script: 'build'
	};
	runCommand(['run', 'build'], packageJson);
}

export async function yarnRunLastScript() {
	if (lastScript) {
		const rootPath = lastScript.packageJson;

		if (rootPath !== null && !packageExists(rootPath)) {
			Messages.noPackageError();
			return;
		}

		runCommand(['run', lastScript.script], rootPath);
	}
	else {
		Messages.noLastScript();
	}
}

const readScripts = function (packgeJson: string) {
	try {
		const content = Fs.readFileSync(packgeJson).toString();
		const json = JSON.parse(content);

		if (json.scripts) {
			return json.scripts;
		}

		Messages.noScriptsInfo();
		return null;
	}
	catch (ignored) {
		Messages.noPackageError();
		return null;
	}
};
