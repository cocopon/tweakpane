import {PickerLayout} from '../../../blade/common/api/types';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';

interface Config {
	pickerLayout: PickerLayout;
}

const className = ClassName('clswtxt');

/**
 * @hidden
 */
export class ColorSwatchTextView implements View {
	public readonly element: HTMLElement;
	public readonly swatchElement: HTMLElement;
	public readonly textElement: HTMLElement;
	public readonly pickerElement: HTMLElement | null;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const headElem = doc.createElement('div');
		headElem.classList.add(className('h'));
		this.element.appendChild(headElem);

		const swatchElem = doc.createElement('div');
		swatchElem.classList.add(className('s'));
		headElem.appendChild(swatchElem);
		this.swatchElement = swatchElem;

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
