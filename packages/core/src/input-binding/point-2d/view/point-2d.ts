import {createSvgIconElement} from '../../../common/dom-util';
import {bindValue} from '../../../common/model/reactive';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {PickerLayout} from '../../../common/params';
import {ClassName} from '../../../common/view/class-name';
import {valueToClassName} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

interface Config {
	expanded: Value<boolean>;
	pickerLayout: PickerLayout;
	viewProps: ViewProps;
}

const className = ClassName('p2d');

/**
 * @hidden
 */
export class Point2dView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;
	public readonly textElement: HTMLElement;
	public readonly pickerElement: HTMLElement | null;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);
		bindValue(
			config.expanded,
			valueToClassName(this.element, className(undefined, 'expanded')),
		);

		const headElem = doc.createElement('div');
		headElem.classList.add(className('h'));
		this.element.appendChild(headElem);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		buttonElem.appendChild(createSvgIconElement(doc, 'p2dpad'));
		config.viewProps.bindDisabled(buttonElem);
		headElem.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const textElem = doc.createElement('div');
		textElem.classList.add(className('t'));
		headElem.appendChild(textElem);
		this.textElement = textElem;

		if (config.pickerLayout === 'inline') {
			const pickerElem = doc.createElement('div');
			pickerElem.classList.add(className('p'));
			this.element.appendChild(pickerElem);
			this.pickerElement = pickerElem;
		} else {
			this.pickerElement = null;
		}
	}
}
