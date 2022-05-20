import {NumberTextView} from '../../../common/number/view/number-text';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {APaletteView} from './a-palette';
import {ColorTextView} from './color-text';
import {HPaletteView} from './h-palette';
import {SvPaletteView} from './sv-palette';

const className = ClassName('colp');

interface Config {
	alphaViews: {
		palette: APaletteView;
		text: NumberTextView;
	} | null;
	hPaletteView: HPaletteView;
	supportsAlpha: boolean;
	svPaletteView: SvPaletteView;
	textView: ColorTextView;
}

/**
 * @hidden
 */
export class ColorPickerView implements View {
	public readonly element: HTMLElement;
	private readonly alphaViews_: {
		palette: APaletteView;
		text: NumberTextView;
	} | null = null;
	private readonly hPaletteView_: HPaletteView;
	private readonly svPaletteView_: SvPaletteView;
	private readonly textView_: ColorTextView;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const hsvElem = doc.createElement('div');
		hsvElem.classList.add(className('hsv'));

		const svElem = doc.createElement('div');
		svElem.classList.add(className('sv'));
		this.svPaletteView_ = config.svPaletteView;
		svElem.appendChild(this.svPaletteView_.element);
		hsvElem.appendChild(svElem);

		const hElem = doc.createElement('div');
		hElem.classList.add(className('h'));
		this.hPaletteView_ = config.hPaletteView;
		hElem.appendChild(this.hPaletteView_.element);
		hsvElem.appendChild(hElem);
		this.element.appendChild(hsvElem);

		const rgbElem = doc.createElement('div');
		rgbElem.classList.add(className('rgb'));
		this.textView_ = config.textView;
		rgbElem.appendChild(this.textView_.element);
		this.element.appendChild(rgbElem);

		if (config.alphaViews) {
			this.alphaViews_ = {
				palette: config.alphaViews.palette,
				text: config.alphaViews.text,
			};

			const aElem = doc.createElement('div');
			aElem.classList.add(className('a'));

			const apElem = doc.createElement('div');
			apElem.classList.add(className('ap'));
			apElem.appendChild(this.alphaViews_.palette.element);
			aElem.appendChild(apElem);

			const atElem = doc.createElement('div');
			atElem.classList.add(className('at'));
			atElem.appendChild(this.alphaViews_.text.element);
			aElem.appendChild(atElem);

			this.element.appendChild(aElem);
		}
	}

	get allFocusableElements(): HTMLElement[] {
		const elems = [
			this.svPaletteView_.element,
			this.hPaletteView_.element,
			this.textView_.modeSelectElement,
			...this.textView_.textViews.map((v) => v.inputElement),
		];
		if (this.alphaViews_) {
			elems.push(
				this.alphaViews_.palette.element,
				this.alphaViews_.text.inputElement,
			);
		}
		return elems;
	}
}
