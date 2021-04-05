import {removeChildNodes} from '../../../common/dom-util';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindClassModifier, bindValueMap} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';
import {isEmpty} from '../../../misc/type-util';

export type LabeledPropsObject = {
	label: string | undefined;
};

export type LabeledProps = ValueMap<LabeledPropsObject>;

interface Config {
	props: LabeledProps;
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
	public readonly labelElement: HTMLElement;
	public readonly valueElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);

		const labelElem = doc.createElement('div');
		labelElem.classList.add(className('l'));
		bindValueMap(config.props, 'label', (value: string | undefined) => {
			if (isEmpty(value)) {
				this.element.classList.add(className(undefined, 'nol'));
			} else {
				this.element.classList.remove(className(undefined, 'nol'));
				removeChildNodes(labelElem);
				labelElem.appendChild(createLabelNode(doc, value));
			}
		});
		this.element.appendChild(labelElem);
		this.labelElement = labelElem;

		const valueElem = doc.createElement('div');
		valueElem.classList.add(className('v'));
		this.element.appendChild(valueElem);
		this.valueElement = valueElem;
	}
}
