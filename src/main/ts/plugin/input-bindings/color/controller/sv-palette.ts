import {
	getBaseStepForColor,
	getHorizontalStepKeys,
	getStepForKey,
	getVerticalStepKeys,
	isArrowKey,
} from '../../../common/controller/ui';
import {ValueController} from '../../../common/controller/value';
import {Color} from '../../../common/model/color';
import {Value} from '../../../common/model/value';
import {ViewModel} from '../../../common/model/view-model';
import * as NumberUtil from '../../../common/number-util';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvents,
} from '../../../common/view/pointer-handler';
import {SvPaletteView} from '../view/sv-palette';

interface Config {
	value: Value<Color>;
	viewModel: ViewModel;
}

/**
 * @hidden
 */
export class SvPaletteController implements ValueController<Color> {
	public readonly viewModel: ViewModel;
	public readonly value: Value<Color>;
	public readonly view: SvPaletteView;
	private ptHandler_: PointerHandler;

	constructor(document: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;

		this.viewModel = config.viewModel;
		this.view = new SvPaletteView(document, {
			model: this.viewModel,
			value: this.value,
		});

		this.ptHandler_ = new PointerHandler(document, this.view.element);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.element.addEventListener('keydown', this.onKeyDown_);
	}

	private handlePointerEvent_(d: PointerData): void {
		const saturation = NumberUtil.map(d.px, 0, 1, 0, 100);
		const value = NumberUtil.map(d.py, 0, 1, 100, 0);

		const [h, , , a] = this.value.rawValue.getComponents('hsv');
		this.value.rawValue = new Color([h, saturation, value, a], 'hsv');
		this.view.update();
	}

	private onPointerDown_(ev: PointerHandlerEvents['down']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onPointerMove_(ev: PointerHandlerEvents['move']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onPointerUp_(ev: PointerHandlerEvents['up']): void {
		this.handlePointerEvent_(ev.data);
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		if (isArrowKey(ev.keyCode)) {
			ev.preventDefault();
		}

		const [h, s, v, a] = this.value.rawValue.getComponents('hsv');
		const baseStep = getBaseStepForColor(false);

		this.value.rawValue = new Color(
			[
				h,
				s + getStepForKey(baseStep, getHorizontalStepKeys(ev)),
				v + getStepForKey(baseStep, getVerticalStepKeys(ev)),
				a,
			],
			'hsv',
		);
	}
}
