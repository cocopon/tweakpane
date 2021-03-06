import {createSvgIconElement} from '../../../common/dom-util';
import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {NumberTextView} from '../../number/view/number-text';
import {Color} from '../model/color';
import {PickedColor} from '../model/picked-color';

interface Config {
	pickedColor: PickedColor;
	textViews: [NumberTextView, NumberTextView, NumberTextView];
}

const className = ClassName('cltxt');

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
export class ColorTextView implements ValueView<Color> {
	public readonly element: HTMLElement;
	public readonly pickedColor: PickedColor;
	private textViews_: [NumberTextView, NumberTextView, NumberTextView];
	private modeElem_: HTMLSelectElement;
	private textsElem_: HTMLElement;

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
		modeMarkerElem.appendChild(createSvgIconElement(doc, 'dropdown'));
		modeElem.appendChild(modeMarkerElem);

		this.element.appendChild(modeElem);

		const textsElem = doc.createElement('div');
		textsElem.classList.add(className('w'));
		this.element.appendChild(textsElem);
		this.textsElem_ = textsElem;

		this.textViews_ = config.textViews;
		this.applyTextViews_();

		this.pickedColor = config.pickedColor;
		this.pickedColor.emitter.on('change', this.onValueChange_);

		this.update();
	}

	get modeSelectElement(): HTMLSelectElement {
		return this.modeElem_;
	}

	get textViews(): [NumberTextView, NumberTextView, NumberTextView] {
		return this.textViews_;
	}

	set textViews(textViews: [NumberTextView, NumberTextView, NumberTextView]) {
		this.textViews_ = textViews;
		this.applyTextViews_();
	}

	get value(): Value<Color> {
		return this.pickedColor.value;
	}

	public update(): void {
		this.modeElem_.value = this.pickedColor.mode;
	}

	private applyTextViews_() {
		while (this.textsElem_.children.length > 0) {
			this.textsElem_.removeChild(this.textsElem_.children[0]);
		}

		const doc = this.element.ownerDocument;
		this.textViews_.forEach((v) => {
			const compElem = doc.createElement('div');
			compElem.classList.add(className('c'));
			compElem.appendChild(v.element);
			this.textsElem_.appendChild(compElem);
		});
	}

	private onValueChange_(): void {
		this.update();
	}
}
