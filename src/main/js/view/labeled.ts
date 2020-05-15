import {ClassName} from '../misc/class-name';
import {View, ViewConfig} from './view';

interface Config extends ViewConfig {
	label: string;
	view: View;
}

const className = ClassName('lbl');

/**
 * @hidden
 */
export class LabeledView extends View {
	public readonly label: string;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.label = config.label;

		this.element.classList.add(className());

		const labelElem = document.createElement('div');
		labelElem.classList.add(className('l'));
		labelElem.textContent = this.label;
		this.element.appendChild(labelElem);

		const viewElem = document.createElement('div');
		viewElem.classList.add(className('v'));
		viewElem.appendChild(config.view.element);
		this.element.appendChild(viewElem);
	}
}
