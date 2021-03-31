import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {mapRange} from '../../../common/number-util';
import {getHorizontalStepKeys, getStepForKey} from '../../../common/ui';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvent,
} from '../../../common/view/pointer-handler';
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
	private props_: SliderProps;
	private ptHandler_: PointerHandler;
	private baseStep_: number;

	constructor(doc: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPoint_ = this.onPoint_.bind(this);

		this.baseStep_ = config.baseStep;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.props_ = config.props;

		this.view = new SliderView(doc, {
			props: this.props_,
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
			d.point.x,
			0,
			d.bounds.width,
			this.props_.get('minValue'),
			this.props_.get('maxValue'),
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
