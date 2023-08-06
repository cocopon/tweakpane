import {isEmpty} from '../../../misc/type-util.js';
import {removeChildNodes} from '../../dom-util.js';
import {bindValueMap} from '../../model/reactive.js';
import {ValueMap} from '../../model/value-map.js';
import {ViewProps} from '../../model/view-props.js';
import {ClassName} from '../../view/class-name.js';
import {View} from '../../view/view.js';

/**
 * @hidden
 */
export type LabelPropsObject = {
	label: string | null | undefined;
};

/**
 * @hidden
 */
export type LabelProps = ValueMap<LabelPropsObject>;

/**
 * @hidden
 */
interface Config {
	props: LabelProps;
	viewProps: ViewProps;
}

const cn = ClassName('lbl');

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
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const labelElem = doc.createElement('div');
		labelElem.classList.add(cn('l'));
		bindValueMap(config.props, 'label', (value: string | null | undefined) => {
			if (isEmpty(value)) {
				this.element.classList.add(cn(undefined, 'nol'));
			} else {
				this.element.classList.remove(cn(undefined, 'nol'));
				removeChildNodes(labelElem);
				labelElem.appendChild(createLabelNode(doc, value));
			}
		});
		this.element.appendChild(labelElem);
		this.labelElement = labelElem;

		const valueElem = doc.createElement('div');
		valueElem.classList.add(cn('v'));
		this.element.appendChild(valueElem);
		this.valueElement = valueElem;
	}
}
