import {NumberFormatter} from '../../formatter/number';
import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import {PaneError} from '../../misc/pane-error';
import {Color} from '../../model/color';
import {InputValue} from '../../model/input-value';
import {PickedColor} from '../../model/picked-color';
import {View, ViewConfig} from '../view';
import {InputView} from './input';

interface Config extends ViewConfig {
	pickedColor: PickedColor;
	supportsAlpha: boolean;
}

type HtmlInputElements3 = [
	HTMLInputElement,
	HTMLInputElement,
	HTMLInputElement,
];
type HtmlInputElements4 = [
	HTMLInputElement,
	HTMLInputElement,
	HTMLInputElement,
	HTMLInputElement,
];

const className = ClassName('cctxts', 'input');
const alphaFormatter = new NumberFormatter(2);
const nonAlphaFormatter = new NumberFormatter(0);

function createModeSelectElement(
	document: Document,
	supportsAlpha: boolean,
): HTMLSelectElement {
	const selectElem = document.createElement('select');
	const items = supportsAlpha
		? [
				{text: 'RGBA', value: 'rgb'},
				{text: 'HSLA', value: 'hsl'},
				{text: 'HSVA', value: 'hsv'},
		  ]
		: [
				{text: 'RGB', value: 'rgb'},
				{text: 'HSL', value: 'hsl'},
				{text: 'HSV', value: 'hsv'},
		  ];
	selectElem.appendChild(
		items.reduce((frag, item) => {
			const optElem = document.createElement('option');
			optElem.textContent = item.text;
			optElem.value = item.value;
			frag.appendChild(optElem);
			return frag;
		}, document.createDocumentFragment()),
	);
	return selectElem;
}

/**
 * @hidden
 */
export class ColorComponentTextsInputView extends View
	implements InputView<Color> {
	public readonly pickedColor: PickedColor;
	public readonly modeSelectElement: HTMLSelectElement;
	private inputElems_: HtmlInputElements3 | HtmlInputElements4 | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onValueChange_ = this.onValueChange_.bind(this);

		this.element.classList.add(className());

		const modeElem = document.createElement('div');
		modeElem.classList.add(className('m'));
		this.modeSelectElement = createModeSelectElement(
			document,
			config.supportsAlpha,
		);
		this.modeSelectElement.classList.add(className('ms'));
		modeElem.appendChild(this.modeSelectElement);

		const modeMarkerElem = document.createElement('div');
		modeMarkerElem.classList.add(className('mm'));
		modeElem.appendChild(modeMarkerElem);

		this.element.appendChild(modeElem);

		const wrapperElem = document.createElement('div');
		wrapperElem.classList.add(className('w'));
		this.element.appendChild(wrapperElem);

		const indexes = config.supportsAlpha ? [0, 1, 2, 3] : [0, 1, 2];
		const inputElems = indexes.map(() => {
			const inputElem = document.createElement('input');
			inputElem.classList.add(className('i'));
			inputElem.type = 'text';
			return inputElem;
		});
		inputElems.forEach((elem) => {
			wrapperElem.appendChild(elem);
		});
		this.inputElems_ = config.supportsAlpha
			? [inputElems[0], inputElems[1], inputElems[2], inputElems[3]]
			: [inputElems[0], inputElems[1], inputElems[2]];

		this.pickedColor = config.pickedColor;
		this.pickedColor.emitter.on('change', this.onValueChange_);

		this.update();

		config.model.emitter.on('dispose', () => {
			if (this.inputElems_) {
				this.inputElems_.forEach((elem) => {
					DisposingUtil.disposeElement(elem);
				});
				this.inputElems_ = null;
			}
		});
	}

	get inputElements(): HtmlInputElements3 | HtmlInputElements4 {
		if (!this.inputElems_) {
			throw PaneError.alreadyDisposed();
		}
		return this.inputElems_;
	}

	get value(): InputValue<Color> {
		return this.pickedColor.value;
	}

	public update(): void {
		const inputElems = this.inputElems_;
		if (!inputElems) {
			throw PaneError.alreadyDisposed();
		}

		const comps = this.pickedColor.value.rawValue.getComponents(
			this.pickedColor.mode,
		);
		comps.forEach((comp, index) => {
			const inputElem = inputElems[index];
			if (!inputElem) {
				return;
			}

			const formatter = index === 3 ? alphaFormatter : nonAlphaFormatter;
			inputElem.value = formatter.format(comp);
		});
	}

	private onValueChange_(): void {
		this.update();
	}
}
