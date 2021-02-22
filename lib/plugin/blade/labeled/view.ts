import {ClassName} from '../../common/view/class-name';
import {View} from '../../common/view/view';

interface Config {
	label: string;
	view: View;
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
	public readonly label: string;
	private elem_: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.label = config.label;

		this.elem_ = doc.createElement('div');
		this.elem_.classList.add(className());

		const labelElem = doc.createElement('div');
		labelElem.classList.add(className('l'));
		labelElem.appendChild(createLabelNode(doc, this.label));
		this.elem_.appendChild(labelElem);

		const viewElem = doc.createElement('div');
		viewElem.classList.add(className('v'));
		viewElem.appendChild(config.view.element);
		this.elem_.appendChild(viewElem);
	}

	get element(): HTMLElement {
		return this.elem_;
	}
}
