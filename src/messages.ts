import { window as Window } from 'vscode';

export function noPackageError() {
	Window.showErrorMessage('Cannot read \'package.json\'');
};

export function alreadyExistsError() {
	Window.showErrorMessage('\'package.json\' already exists');
};

export function noProjectOpenError() {
	Window.showErrorMessage('No project open');
};

export function noLastScript() {
	Window.showErrorMessage('No script executed yet');
}

export function noTestScript() {
	Window.showErrorMessage('No test script in your package.json file');
}

export function noStartScript() {
	Window.showErrorMessage('No start script in your package.json file');
}

export function noScriptsInfo() {
	Window.showInformationMessage('No scripts are defined in \'package.json\'');
};


export function cannotWriteError() {
	Window.showErrorMessage('Cannot write \'package.json\'');
};


export function createdInfo() {
	Window.showInformationMessage('\'package.json\' created successfuly');
};


export function noValueError() {
	Window.showErrorMessage('No value entered');
};


export function invalidTagError() {
	Window.showErrorMessage('Tag is invalid');
};
