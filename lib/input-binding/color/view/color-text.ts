import {
	createSvgIconElement,
	removeChildElements,
} from '../../../common/dom-util';
import {NumberTextView} from '../../../common/number/view/number-text';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
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
export class ColorTextView implements View {
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

		this.update_();
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

	private update_(): void {
		this.modeElem_.value = this.pickedColor.mode;
	}

	private applyTextViews_() {
		removeChildElements(this.textsElem_);

		const doc = this.element.ownerDocument;
		this.textViews_.forEach((v) => {
			const compElem = doc.createElement('div');
			compElem.classList.add(className('c'));
			compElem.appendChild(v.element);
			this.textsElem_.appendChild(compElem);
		});
	}

	private onValueChange_(): void {
		this.update_();
	}
}
