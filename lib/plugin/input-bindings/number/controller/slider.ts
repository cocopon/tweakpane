import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {mapRange} from '../../../common/number-util';
import {getHorizontalStepKeys, getStepForKey} from '../../../common/ui';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvent,
} from '../../../common/view/pointer-handler';
import {SliderView} from '../view/slider';

interface Config {
	baseStep: number;
	maxValue: number;
	minValue: number;
	value: Value<number>;
}

/**
 * @hidden
 */
export class SliderController implements ValueController<number> {
	public readonly value: Value<number>;
	public readonly view: SliderView;
	private maxValue_: number;
	private minValue_: number;
	private ptHandler_: PointerHandler;
	private baseStep_: number;

	constructor(doc: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPoint_ = this.onPoint_.bind(this);

		this.value = config.value;
		this.baseStep_ = config.baseStep;

		this.minValue_ = config.minValue;
		this.maxValue_ = config.maxValue;

		this.view = new SliderView(doc, {
			maxValue: this.maxValue_,
			minValue: this.minValue_,
			value: this.value,
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
			this.minValue_,
			this.maxValue_,
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
