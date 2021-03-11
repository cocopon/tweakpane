import {forceCast} from '../../../../misc/type-util';
import {Foldable} from '../../../common/model/foldable';
import {Value} from '../../../common/model/value';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {TextView} from '../../common/view/text';
import {Color} from '../model/color';
import {PickedColor} from '../model/picked-color';
import {APaletteView} from './a-palette';
import {ColorTextView} from './color-text';
import {HPaletteView} from './h-palette';
import {SvPaletteView} from './sv-palette';

const className = ClassName('clp');

interface Config {
	alphaViews: {
		palette: APaletteView;
		text: TextView<number>;
	} | null;
	foldable: Foldable;
	hPaletteView: HPaletteView;
	pickedColor: PickedColor;
	supportsAlpha: boolean;
	svPaletteView: SvPaletteView;
	textView: ColorTextView;
}

/**
 * @hidden
 */
export class ColorPickerView implements ValueView<Color> {
	public readonly element: HTMLElement;
	public readonly foldable: Foldable;
	public readonly pickedColor: PickedColor;
	private alphaViews_: {
		palette: APaletteView;
		text: TextView<number>;
	} | null = null;
	private hPaletteView_: HPaletteView;
	private svPaletteView_: SvPaletteView;
	private textView_: ColorTextView;

	constructor(doc: Document, config: Config) {
		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.pickedColor = config.pickedColor;
		this.pickedColor.value.emitter.on('change', this.onValueChange_);

		this.foldable = config.foldable;
		this.foldable.emitter.on('change', this.onFoldableChange_);

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

		this.update();
	}

	get allFocusableElements(): HTMLElement[] {
		const elems = [
			this.svPaletteView_.element,
			this.hPaletteView_.element,
			...this.textView_.textViews.map((v) => v.inputElement),
		];
		if (this.alphaViews_) {
			elems.push(
				this.alphaViews_.palette.element,
				this.alphaViews_.text.inputElement,
			);
		}
		return forceCast(elems);
	}

	get value(): Value<Color> {
		return this.pickedColor.value;
	}

	public update(): void {
		if (this.foldable.expanded) {
			this.element.classList.add(className(undefined, 'expanded'));
		} else {
			this.element.classList.remove(className(undefined, 'expanded'));
		}
	}

	private onValueChange_(): void {
		this.update();
	}

	private onFoldableChange_(): void {
		this.update();
	}
}
