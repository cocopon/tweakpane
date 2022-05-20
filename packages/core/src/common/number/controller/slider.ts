import {Controller} from '../../controller/controller';
import {Value, ValueChangeOptions} from '../../model/value';
import {ViewProps} from '../../model/view-props';
import {constrainRange, mapRange} from '../../number-util';
import {getHorizontalStepKeys, getStepForKey} from '../../ui';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvent,
} from '../../view/pointer-handler';
import {SliderProps, SliderView} from '../view/slider';

interface Config {
	baseStep: number;
	props: SliderProps;
	value: Value<number>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class SliderController implements Controller<SliderView> {
	public readonly value: Value<number>;
	public readonly view: SliderView;
	public readonly viewProps: ViewProps;
	public readonly props: SliderProps;
	private readonly ptHandler_: PointerHandler;
	private readonly baseStep_: number;

	constructor(doc: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onKeyUp_ = this.onKeyUp_.bind(this);
		this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.baseStep_ = config.baseStep;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.props = config.props;

		this.view = new SliderView(doc, {
			props: this.props,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.ptHandler_ = new PointerHandler(this.view.trackElement);
		this.ptHandler_.emitter.on('down', this.onPointerDownOrMove_);
		this.ptHandler_.emitter.on('move', this.onPointerDownOrMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.trackElement.addEventListener('keydown', this.onKeyDown_);
		this.view.trackElement.addEventListener('keyup', this.onKeyUp_);
	}

	private handlePointerEvent_(d: PointerData, opts: ValueChangeOptions): void {
		if (!d.point) {
			return;
		}

		this.value.setRawValue(
			mapRange(
				constrainRange(d.point.x, 0, d.bounds.width),
				0,
				d.bounds.width,
				this.props.get('minValue'),
				this.props.get('maxValue'),
			),
			opts,
		);
	}

	private onPointerDownOrMove_(ev: PointerHandlerEvent): void {
		this.handlePointerEvent_(ev.data, {
			forceEmit: false,
			last: false,
		});
	}

	private onPointerUp_(ev: PointerHandlerEvent): void {
		this.handlePointerEvent_(ev.data, {
			forceEmit: true,
			last: true,
		});
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		const step = getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
		if (step === 0) {
			return;
		}
		this.value.setRawValue(this.value.rawValue + step, {
			forceEmit: false,
			last: false,
		});
	}

	private onKeyUp_(ev: KeyboardEvent): void {
		const step = getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
		if (step === 0) {
			return;
		}
		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		});
	}
}
