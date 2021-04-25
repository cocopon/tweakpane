import {PickerLayout} from '../../../blade/common/api/types';
import {createSvgIconElement} from '../../../common/dom-util';
import {ViewProps} from '../../../common/model/view-props';
import {ClassName} from '../../../common/view/class-name';
import {bindClassModifier, bindDisabled} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';

interface Config {
	pickerLayout: PickerLayout;
	viewProps: ViewProps;
}

const className = ClassName('p2dpadtxt');

/**
 * @hidden
 */
export class Point2dView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement | null;
	public readonly textElement: HTMLElement;
	public readonly pickerElement: HTMLElement | null;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		bindClassModifier(config.viewProps, this.element);

		const headElem = doc.createElement('div');
		headElem.classList.add(className('h'));
		this.element.appendChild(headElem);

		if (config.pickerLayout === 'popup') {
			const buttonElem = doc.createElement('button');
			buttonElem.classList.add(className('b'));
			buttonElem.appendChild(createSvgIconElement(doc, 'p2dpad'));
			bindDisabled(config.viewProps, buttonElem);
			headElem.appendChild(buttonElem);
			this.buttonElement = buttonElem;
		} else {
			this.buttonElement = null;
		}

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
