import {ValueController} from '../../../common/controller/value.js';
import {Value, ValueChangeOptions} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {mapRange} from '../../../common/number/util.js';
import {
	getHorizontalStepKeys,
	getStepForKey,
	getVerticalStepKeys,
	isArrowKey,
} from '../../../common/ui.js';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvents,
} from '../../../common/view/pointer-handler.js';
import {IntColor} from '../model/int-color.js';
import {getKeyScaleForColor} from '../util.js';
import {SvPaletteView} from '../view/sv-palette.js';

interface Config {
	value: Value<IntColor>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SvPaletteController
	implements ValueController<IntColor, SvPaletteView>
{
	public readonly value: Value<IntColor>;
	public readonly view: SvPaletteView;
	public readonly viewProps: ViewProps;
	private readonly ptHandler_: PointerHandler;

	constructor(doc: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onKeyUp_ = this.onKeyUp_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new SvPaletteView(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});

		this.ptHandler_ = new PointerHandler(this.view.element);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.element.addEventListener('keydown', this.onKeyDown_);
		this.view.element.addEventListener('keyup', this.onKeyUp_);
	}

	private handlePointerEvent_(d: PointerData, opts: ValueChangeOptions): void {
		if (!d.point) {
			return;
		}

		const saturation = mapRange(d.point.x, 0, d.bounds.width, 0, 100);
		const value = mapRange(d.point.y, 0, d.bounds.height, 100, 0);

		const [h, , , a] = this.value.rawValue.getComponents('hsv');
		this.value.setRawValue(
			new IntColor([h, saturation, value, a], 'hsv'),
			opts,
		);
	}

	private onPointerDown_(ev: PointerHandlerEvents['down']): void {
		this.handlePointerEvent_(ev.data, {
			forceEmit: false,
			last: false,
		});
	}

	private onPointerMove_(ev: PointerHandlerEvents['move']): void {
		this.handlePointerEvent_(ev.data, {
			forceEmit: false,
			last: false,
		});
	}

	private onPointerUp_(ev: PointerHandlerEvents['up']): void {
		this.handlePointerEvent_(ev.data, {
			forceEmit: true,
			last: true,
		});
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		if (isArrowKey(ev.key)) {
			ev.preventDefault();
		}

		const [h, s, v, a] = this.value.rawValue.getComponents('hsv');
		const keyScale = getKeyScaleForColor(false);
		const ds = getStepForKey(keyScale, getHorizontalStepKeys(ev));
		const dv = getStepForKey(keyScale, getVerticalStepKeys(ev));
		if (ds === 0 && dv === 0) {
			return;
		}

		this.value.setRawValue(new IntColor([h, s + ds, v + dv, a], 'hsv'), {
			forceEmit: false,
			last: false,
		});
	}

	private onKeyUp_(ev: KeyboardEvent): void {
		const keyScale = getKeyScaleForColor(false);
		const ds = getStepForKey(keyScale, getHorizontalStepKeys(ev));
		const dv = getStepForKey(keyScale, getVerticalStepKeys(ev));
		if (ds === 0 && dv === 0) {
			return;
		}

		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		});
	}
}
