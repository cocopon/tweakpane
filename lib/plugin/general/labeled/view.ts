import {ClassName} from '../../common/view/class-name';
import {View, ViewConfig} from '../../common/view/view';

interface Config extends ViewConfig {
	label: string;
	view: View;
}

const className = ClassName('lbl');

function createLabelNode(document: Document, label: string): DocumentFragment {
	const frag = document.createDocumentFragment();

	const lineNodes = label.split('\n').map((line) => {
		return document.createTextNode(line);
	});
	lineNodes.forEach((lineNode, index) => {
		if (index > 0) {
			frag.appendChild(document.createElement('br'));
		}
		frag.appendChild(lineNode);
	});

	return frag;
}

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
		labelElem.appendChild(createLabelNode(document, this.label));
		this.element.appendChild(labelElem);

		const viewElem = document.createElement('div');
		viewElem.classList.add(className('v'));
		viewElem.appendChild(config.view.element);
		this.element.appendChild(viewElem);
	}
}
