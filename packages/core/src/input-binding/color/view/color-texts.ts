import {
	createSvgIconElement,
	removeChildElements,
} from '../../../common/dom-util.js';
import {bindValue} from '../../../common/model/reactive.js';
import {Value} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {ClassName} from '../../../common/view/class-name.js';
import {InputView, View} from '../../../common/view/view.js';
import {ColorMode} from '../model/color-model.js';

export type ColorTextsMode = ColorMode | 'hex';

interface Config {
	inputViews: InputView[];
	mode: Value<ColorTextsMode>;
	viewProps: ViewProps;
}

const cn = ClassName('coltxt');

function createModeSelectElement(doc: Document): HTMLSelectElement {
	const selectElem = doc.createElement('select');
	const items = [
		{text: 'RGB', value: 'rgb'},
		{text: 'HSL', value: 'hsl'},
		{text: 'HSV', value: 'hsv'},
		{text: 'HEX', value: 'hex'},
	];
	selectElem.appendChild(
		items.reduce((frag, item) => {
			const optElem = doc.createElement('option');
			optElem.textContent = item.text;
			optElem.value = item.value;
			frag.appendChild(optElem);
			return frag;
		}, doc.createDocumentFragment()),
	);
	return selectElem;
}

/**
 * @hidden
 */
export class ColorTextsView implements View {
	public readonly element: HTMLElement;
	private readonly modeElem_: HTMLSelectElement;
	private readonly inputsElem_: HTMLElement;
	private inputViews_: InputView[];

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const modeElem = doc.createElement('div');
		modeElem.classList.add(cn('m'));
		this.modeElem_ = createModeSelectElement(doc);
		this.modeElem_.classList.add(cn('ms'));
		modeElem.appendChild(this.modeSelectElement);
		config.viewProps.bindDisabled(this.modeElem_);

		const modeMarkerElem = doc.createElement('div');
		modeMarkerElem.classList.add(cn('mm'));
		modeMarkerElem.appendChild(createSvgIconElement(doc, 'dropdown'));
		modeElem.appendChild(modeMarkerElem);

		this.element.appendChild(modeElem);

		const inputsElem = doc.createElement('div');
		inputsElem.classList.add(cn('w'));
		this.element.appendChild(inputsElem);
		this.inputsElem_ = inputsElem;

		this.inputViews_ = config.inputViews;
		this.applyInputViews_();

		bindValue(config.mode, (mode) => {
			this.modeElem_.value = mode;
		});
	}

	get modeSelectElement(): HTMLSelectElement {
		return this.modeElem_;
	}

	get inputViews(): InputView[] {
		return this.inputViews_;
	}

	set inputViews(inputViews: InputView[]) {
		this.inputViews_ = inputViews;
		this.applyInputViews_();
	}

	private applyInputViews_() {
		removeChildElements(this.inputsElem_);

		const doc = this.element.ownerDocument;
		this.inputViews_.forEach((v) => {
			const compElem = doc.createElement('div');
			compElem.classList.add(cn('c'));
			compElem.appendChild(v.element);
			this.inputsElem_.appendChild(compElem);
		});
	}
}
