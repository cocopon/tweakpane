import {Controller} from '../../../common/controller/controller';
import {Value, ValueChangeOptions} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {constrainRange, mapRange} from '../../../common/number-util';
import {getHorizontalStepKeys, getStepForKey} from '../../../common/ui';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvents,
} from '../../../common/view/pointer-handler';
import {Color} from '../model/color';
import {getBaseStepForColor} from '../util';
import {HPaletteView} from '../view/h-palette';

interface Config {
	value: Value<Color>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class HPaletteController implements Controller<HPaletteView> {
	public readonly value: Value<Color>;
	public readonly view: HPaletteView;
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

		this.view = new HPaletteView(doc, {
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

		const hue = mapRange(
			constrainRange(d.point.x, 0, d.bounds.width),
			0,
			d.bounds.width,
			0,
			359,
		);

		const c = this.value.rawValue;
		const [, s, v, a] = c.getComponents('hsv');
		this.value.setRawValue(new Color([hue, s, v, a], 'hsv'), opts);
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
		const step = getStepForKey(
			getBaseStepForColor(false),
			getHorizontalStepKeys(ev),
		);
		if (step === 0) {
			return;
		}

		const c = this.value.rawValue;
		const [h, s, v, a] = c.getComponents('hsv');
		this.value.setRawValue(new Color([h + step, s, v, a], 'hsv'), {
			forceEmit: false,
			last: false,
		});
	}

	private onKeyUp_(ev: KeyboardEvent): void {
		const step = getStepForKey(
			getBaseStepForColor(false),
			getHorizontalStepKeys(ev),
		);
		if (step === 0) {
			return;
		}

		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		});
	}
}
