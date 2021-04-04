import {ValueController} from '../../controller/value';
import {Value} from '../../model/value';
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
export class SliderController implements ValueController<number> {
	public readonly value: Value<number>;
	public readonly view: SliderView;
	public readonly viewProps: ViewProps;
	public readonly props: SliderProps;
	private ptHandler_: PointerHandler;
	private baseStep_: number;

	constructor(doc: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPoint_ = this.onPoint_.bind(this);

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
		this.ptHandler_.emitter.on('down', this.onPoint_);
		this.ptHandler_.emitter.on('move', this.onPoint_);
		this.ptHandler_.emitter.on('up', this.onPoint_);

		this.view.trackElement.addEventListener('keydown', this.onKeyDown_);
	}

	private handlePointerEvent_(d: PointerData): void {
		if (!d.point) {
			return;
		}

		this.value.rawValue = mapRange(
			constrainRange(d.point.x, 0, d.bounds.width),
			0,
			d.bounds.width,
			this.props.get('minValue'),
			this.props.get('maxValue'),
		);
	}

	private onPoint_(ev: PointerHandlerEvent): void {
		this.handlePointerEvent_(ev.data);
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		this.value.rawValue += getStepForKey(
			this.baseStep_,
			getHorizontalStepKeys(ev),
		);
	}
}
