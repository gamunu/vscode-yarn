import { window as Window } from 'vscode';

export function noPackageError() {
	Window.showErrorMessage('Cannot read \'package.json\'');
}

export function alreadyExistsError() {
	Window.showErrorMessage('\'package.json\' already exists');
}

export function noProjectOpenError() {
	Window.showErrorMessage('No project open');
}

export function noLastScript() {
	Window.showErrorMessage('No script executed yet');
}

export function noTestScript() {
	Window.showErrorMessage('No test script in your package.json file');
}

export function noStartScript() {
	Window.showErrorMessage('No start script in your package.json file');
}

export function noBuildScript() {
	Window.showErrorMessage('No build script in your package.json file');
}

export function noScriptsInfo() {
	Window.showInformationMessage('No scripts are defined in \'package.json\'');
}

export function cannotWriteError() {
	Window.showErrorMessage('Cannot write \'package.json\'');
}

export function createdInfo() {
	Window.showInformationMessage('\'package.json\' created successfuly');
}

export function noValueError() {
	Window.showErrorMessage('No value entered');
}

export function invalidTagError() {
	Window.showErrorMessage('Tag is invalid');
}

export function searchError(error: string) {
	if (error.includes('Too Many Requests') || error.includes('429')) {
		Window.showErrorMessage('Rate limit exceeded. The npm registry is temporarily limiting requests. Please try again in a few moments.');
	} else {
		Window.showErrorMessage(`Error searching packages: ${error}`);
	}
}

export function noPackagesFound(term: string) {
	Window.showInformationMessage(`No packages found for "${term}"`);
}

export function registryAdded(registry: string) {
	Window.showInformationMessage(`Added registry: ${registry}`);
}

export function registryRemoved(registry: string) {
	Window.showInformationMessage(`Removed registry: ${registry}`);
}

export function noRegistriesConfigured() {
	Window.showInformationMessage('No custom registries configured');
}
