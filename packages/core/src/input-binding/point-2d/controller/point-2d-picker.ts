import {Controller} from '../../../common/controller/controller';
import {Value, ValueChangeOptions} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {mapRange} from '../../../common/number-util';
import {PickerLayout} from '../../../common/params';
import {
	getHorizontalStepKeys,
	getStepForKey,
	getVerticalStepKeys,
	isArrowKey,
} from '../../../common/ui';
import {
	PointerData,
	PointerHandler,
	PointerHandlerEvents,
} from '../../../common/view/pointer-handler';
import {Point2d} from '../model/point-2d';
import {Point2dPickerView} from '../view/point-2d-picker';

interface Config {
	baseSteps: [number, number];
	invertsY: boolean;
	layout: PickerLayout;
	maxValue: number;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

function computeOffset(
	ev: KeyboardEvent,
	baseSteps: [number, number],
	invertsY: boolean,
): [number, number] {
	return [
		getStepForKey(baseSteps[0], getHorizontalStepKeys(ev)),
		getStepForKey(baseSteps[1], getVerticalStepKeys(ev)) * (invertsY ? 1 : -1),
	];
}

/**
 * @hidden
 */
export class Point2dPickerController implements Controller<Point2dPickerView> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dPickerView;
	public readonly viewProps: ViewProps;
	private readonly baseSteps_: [number, number];
	private readonly ptHandler_: PointerHandler;
	private readonly invertsY_: boolean;
	private readonly maxValue_: number;

	constructor(doc: Document, config: Config) {
		this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
		this.onPadKeyUp_ = this.onPadKeyUp_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.baseSteps_ = config.baseSteps;
		this.maxValue_ = config.maxValue;
		this.invertsY_ = config.invertsY;

		this.view = new Point2dPickerView(doc, {
			invertsY: this.invertsY_,
			layout: config.layout,
			maxValue: this.maxValue_,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.ptHandler_ = new PointerHandler(this.view.padElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.padElement.addEventListener('keydown', this.onPadKeyDown_);
		this.view.padElement.addEventListener('keyup', this.onPadKeyUp_);
	}

	private handlePointerEvent_(d: PointerData, opts: ValueChangeOptions): void {
		if (!d.point) {
			return;
		}

		const max = this.maxValue_;
		const px = mapRange(d.point.x, 0, d.bounds.width, -max, +max);
		const py = mapRange(
			this.invertsY_ ? d.bounds.height - d.point.y : d.point.y,
			0,
			d.bounds.height,
			-max,
			+max,
		);
		this.value.setRawValue(new Point2d(px, py), opts);
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

	private onPadKeyDown_(ev: KeyboardEvent): void {
		if (isArrowKey(ev.key)) {
			ev.preventDefault();
		}

		const [dx, dy] = computeOffset(ev, this.baseSteps_, this.invertsY_);
		if (dx === 0 && dy === 0) {
			return;
		}

		this.value.setRawValue(
			new Point2d(this.value.rawValue.x + dx, this.value.rawValue.y + dy),
			{
				forceEmit: false,
				last: false,
			},
		);
	}

	private onPadKeyUp_(ev: KeyboardEvent): void {
		const [dx, dy] = computeOffset(ev, this.baseSteps_, this.invertsY_);
		if (dx === 0 && dy === 0) {
			return;
		}

		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		});
	}
}
