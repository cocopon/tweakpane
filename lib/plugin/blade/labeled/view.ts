import {ClassName} from '../../common/view/class-name';
import {bindViewProps, View, ViewProps} from '../../common/view/view';

interface Config {
	label?: string;
	viewProps: ViewProps;
}

const className = ClassName('lbl');

function createLabelNode(doc: Document, label: string): DocumentFragment {
	const frag = doc.createDocumentFragment();

	const lineNodes = label.split('\n').map((line) => {
		return doc.createTextNode(line);
	});
	lineNodes.forEach((lineNode, index) => {
		if (index > 0) {
			frag.appendChild(doc.createElement('br'));
		}
		frag.appendChild(lineNode);
	});

	return frag;
}

/**
 * @hidden
 */
export class LabeledView implements View {
	public readonly element: HTMLElement;
	public readonly label?: string;
	public readonly valueElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.label = config.label;

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindViewProps(config.viewProps, this.element);

		if (this.label !== undefined) {
			const labelElem = doc.createElement('div');
			labelElem.classList.add(className('l'));
			labelElem.appendChild(createLabelNode(doc, this.label));
			this.element.appendChild(labelElem);
		} else {
			this.element.classList.add(className(undefined, 'nol'));
		}

		const valueElem = doc.createElement('div');
		valueElem.classList.add(className('v'));
		this.element.appendChild(valueElem);
		this.valueElement = valueElem;
	}
}
