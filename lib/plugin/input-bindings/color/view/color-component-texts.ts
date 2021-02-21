import {Color} from '../../../common/model/color';
import {PickedColor} from '../../../common/model/picked-color';
import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {NumberFormatter} from '../../../common/writer/number';

interface Config {
	pickedColor: PickedColor;
}

type HtmlInputElements3 = [
	HTMLInputElement,
	HTMLInputElement,
	HTMLInputElement,
];

const className = ClassName('cctxts');
const FORMATTER = new NumberFormatter(0);

function createModeSelectElement(doc: Document): HTMLSelectElement {
	const selectElem = doc.createElement('select');
	const items = [
		{text: 'RGB', value: 'rgb'},
		{text: 'HSL', value: 'hsl'},
		{text: 'HSV', value: 'hsv'},
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
export class ColorComponentTextsView implements ValueView<Color> {
	public readonly element: HTMLElement;
	public readonly pickedColor: PickedColor;
	private modeElem_: HTMLSelectElement;
	private inputElems_: HtmlInputElements3;

	constructor(doc: Document, config: Config) {
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const modeElem = doc.createElement('div');
		modeElem.classList.add(className('m'));
		this.modeElem_ = createModeSelectElement(doc);
		this.modeElem_.classList.add(className('ms'));
		modeElem.appendChild(this.modeSelectElement);

		const modeMarkerElem = doc.createElement('div');
		modeMarkerElem.classList.add(className('mm'));
		modeElem.appendChild(modeMarkerElem);

		this.element.appendChild(modeElem);

		const wrapperElem = doc.createElement('div');
		wrapperElem.classList.add(className('w'));
		this.element.appendChild(wrapperElem);

		const inputElems = [0, 1, 2].map(() => {
			const inputElem = doc.createElement('input');
			inputElem.classList.add(className('i'));
			inputElem.type = 'text';
			return inputElem;
		});
		inputElems.forEach((elem) => {
			wrapperElem.appendChild(elem);
		});
		this.inputElems_ = [inputElems[0], inputElems[1], inputElems[2]];

		this.pickedColor = config.pickedColor;
		this.pickedColor.emitter.on('change', this.onValueChange_);

		this.update();
	}

	get modeSelectElement(): HTMLSelectElement {
		return this.modeElem_;
	}

	get inputElements(): HtmlInputElements3 {
		return this.inputElems_;
	}

	get value(): Value<Color> {
		return this.pickedColor.value;
	}

	public update(): void {
		this.modeElem_.value = this.pickedColor.mode;

		const comps = this.pickedColor.value.rawValue.getComponents(
			this.pickedColor.mode,
		);
		comps.forEach((comp, index) => {
			const inputElem = this.inputElems_[index];
			if (!inputElem) {
				return;
			}

			inputElem.value = FORMATTER.format(comp);
		});
	}

	private onValueChange_(): void {
		this.update();
	}
}
