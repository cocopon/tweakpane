import {ViewProps} from '../../../common/model/view-props.js';
import {NumberTextView} from '../../../common/number/view/number-text.js';
import {ClassName} from '../../../common/view/class-name.js';
import {View} from '../../../common/view/view.js';
import {APaletteView} from './a-palette.js';
import {ColorTextsView} from './color-texts.js';
import {HPaletteView} from './h-palette.js';
import {SvPaletteView} from './sv-palette.js';

const cn = ClassName('colp');

interface Config {
	alphaViews: {
		palette: APaletteView;
		text: NumberTextView;
	} | null;
	hPaletteView: HPaletteView;
	supportsAlpha: boolean;
	svPaletteView: SvPaletteView;
	textsView: ColorTextsView;
	viewProps: ViewProps;
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
	private readonly textsView_: ColorTextsView;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		const hsvElem = doc.createElement('div');
		hsvElem.classList.add(cn('hsv'));

		const svElem = doc.createElement('div');
		svElem.classList.add(cn('sv'));
		this.svPaletteView_ = config.svPaletteView;
		svElem.appendChild(this.svPaletteView_.element);
		hsvElem.appendChild(svElem);

		const hElem = doc.createElement('div');
		hElem.classList.add(cn('h'));
		this.hPaletteView_ = config.hPaletteView;
		hElem.appendChild(this.hPaletteView_.element);
		hsvElem.appendChild(hElem);
		this.element.appendChild(hsvElem);

		const rgbElem = doc.createElement('div');
		rgbElem.classList.add(cn('rgb'));
		this.textsView_ = config.textsView;
		rgbElem.appendChild(this.textsView_.element);
		this.element.appendChild(rgbElem);

		if (config.alphaViews) {
			this.alphaViews_ = {
				palette: config.alphaViews.palette,
				text: config.alphaViews.text,
			};

			const aElem = doc.createElement('div');
			aElem.classList.add(cn('a'));

			const apElem = doc.createElement('div');
			apElem.classList.add(cn('ap'));
			apElem.appendChild(this.alphaViews_.palette.element);
			aElem.appendChild(apElem);

			const atElem = doc.createElement('div');
			atElem.classList.add(cn('at'));
			atElem.appendChild(this.alphaViews_.text.element);
			aElem.appendChild(atElem);

			this.element.appendChild(aElem);
		}
	}

	get allFocusableElements(): HTMLElement[] {
		const elems = [
			this.svPaletteView_.element,
			this.hPaletteView_.element,
			this.textsView_.modeSelectElement,
			...this.textsView_.inputViews.map((v) => v.inputElement),
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
