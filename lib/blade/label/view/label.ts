import {removeChildNodes} from '../../../common/dom-util';
import {bindValueMap} from '../../../common/model/reactive';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {isEmpty} from '../../../misc/type-util';

export type LabelPropsObject = {
	label: string | undefined;
};

export type LabelProps = ValueMap<LabelPropsObject>;

interface Config {
	props: LabelProps;
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
export class LabelView implements View {
	public readonly element: HTMLElement;
	public readonly labelElement: HTMLElement;
	public readonly valueElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

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
