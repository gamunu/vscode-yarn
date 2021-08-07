import { childs, terminate } from './run-command';
import { useTerminal } from './utils';
import { window as Window, QuickPickItem } from 'vscode';

class Item implements QuickPickItem {
	constructor(public label: string,
		public description: string,
		public pid: number) {
	}
}

export default function () {
	if (useTerminal()) {
		Window.showInformationMessage('Killing is only supported when the setting "runInTerminal" is "false"');
	} else {
		const items: Item[] = [];

		childs.forEach((value) => {
			items.push(new Item(value.cmd, `(pid: ${value.child.pid})`, value.child.pid));
		});

		Window.showQuickPick(items).then((value) => {
			if (value) {
				terminate(value.pid);
			}
		});
	}
}
