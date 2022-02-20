import * as Fs from 'fs';
import * as Path from 'path';
import { workspace as Workspace, window as Window } from 'vscode';
import * as Messages from './messages';
import { packageExists, pickPackageJson } from './utils';

export default async function () {
	const packageJson = await pickPackageJson();

	if (packageJson === null) {
		Messages.noProjectOpenError();
		return;
	}

	if (packageExists(packageJson)) {
		Messages.alreadyExistsError();
		return;
	}

	const directory = Path.basename(packageJson);

	const options = {
		name: directory,
		version: '1.0.0',
		description: '',
		main: 'index.js',
		scripts: {
			test: 'echo "Error: no test specified" && exit 1'
		},
		author: '',
		license: 'ISC'
	};

	Window.showInputBox({
		prompt: 'Package name',
		placeHolder: 'Package name...',
		value: directory
	})
		.then((value) => {

			if (value) {
				options.name = value.toLowerCase();
			}

			return Window.showInputBox({
				prompt: 'Version',
				placeHolder: '1.0.0',
				value: '1.0.0'
			});
		})
		.then((value) => {

			if (value) {
				options.version = value.toString();
			}

			return Window.showInputBox({
				prompt: 'Description',
				placeHolder: 'Package description'
			});
		})
		.then((value) => {

			if (value) {
				options.description = value.toString();
			}

			return Window.showInputBox({
				prompt: 'main (entry point)',
				value: 'index.js'
			});
		})
		.then((value) => {

			if (value) {
				options.main = value.toString();
			}

			return Window.showInputBox({
				prompt: 'Test script'
			});
		})
		.then((value) => {

			if (value) {
				options.scripts.test = value.toString();
			}

			return Window.showInputBox({
				prompt: 'Author'
			});
		})
		.then((value) => {

			if (value) {
				options.author = value.toString();
			}

			return Window.showInputBox({
				prompt: 'License',
				value: 'ISC'
			});
		})
		.then((value) => {

			if (value) {
				options.license = value.toString();
			}

			const content = JSON.stringify(options, null, 4);
			Fs.writeFile(packageJson, content, (err) => {

				if (err) {
					Messages.cannotWriteError();
				}
				else {
					Messages.createdInfo();
					Workspace.openTextDocument(packageJson).then((document) => {
						Window.showTextDocument(document);
					});
				}
			});
		});
}
