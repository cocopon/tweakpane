import {Foldable} from '../../../blade/common/model/foldable.js';
import {bindValueMap} from '../../../common/model/reactive.js';
import {PickerLayout} from '../../../common/params.js';
import {ClassName} from '../../../common/view/class-name.js';
import {valueToClassName} from '../../../common/view/reactive.js';
import {View} from '../../../common/view/view.js';

interface Config {
	foldable: Foldable;
	pickerLayout: PickerLayout;
}

const cn = ClassName('col');

/**
 * @hidden
 */
export class ColorView implements View {
	public readonly element: HTMLElement;
	public readonly swatchElement: HTMLElement;
	public readonly textElement: HTMLElement;
	public readonly pickerElement: HTMLElement | null;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.foldable.bindExpandedClass(this.element, cn(undefined, 'expanded'));
		bindValueMap(
			config.foldable,
			'completed',
			valueToClassName(this.element, cn(undefined, 'cpl')),
		);

		const headElem = doc.createElement('div');
		headElem.classList.add(cn('h'));
		this.element.appendChild(headElem);

		const swatchElem = doc.createElement('div');
		swatchElem.classList.add(cn('s'));
		headElem.appendChild(swatchElem);
		this.swatchElement = swatchElem;

		const textElem = doc.createElement('div');
		textElem.classList.add(cn('t'));
		headElem.appendChild(textElem);
		this.textElement = textElem;

		if (config.pickerLayout === 'inline') {
			const pickerElem = doc.createElement('div');
			pickerElem.classList.add(cn('p'));
			this.element.appendChild(pickerElem);
			this.pickerElement = pickerElem;
		} else {
			this.pickerElement = null;
		}
	}
}
