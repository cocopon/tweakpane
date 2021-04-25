import {PickerLayout} from '../../../blade/common/api/types';
import {ValueController} from '../../../common/controller/value';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {mapRange} from '../../../common/number-util';
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
import {Point2dPadView} from '../view/point-2d-pad';

interface Config {
	baseSteps: [number, number];
	invertsY: boolean;
	layout: PickerLayout;
	maxValue: number;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class Point2dPadController implements ValueController<Point2d> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dPadView;
	public readonly viewProps: ViewProps;
	private readonly baseSteps_: [number, number];
	private readonly ptHandler_: PointerHandler;
	private readonly invertsY_: boolean;
	private readonly maxValue_: number;

	constructor(doc: Document, config: Config) {
		this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.baseSteps_ = config.baseSteps;
		this.maxValue_ = config.maxValue;
		this.invertsY_ = config.invertsY;

		this.view = new Point2dPadView(doc, {
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
	}

	private handlePointerEvent_(d: PointerData): void {
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
		this.value.rawValue = new Point2d(px, py);
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

	private onPadKeyDown_(ev: KeyboardEvent): void {
		if (isArrowKey(ev.key)) {
			ev.preventDefault();
		}

		this.value.rawValue = new Point2d(
			this.value.rawValue.x +
				getStepForKey(this.baseSteps_[0], getHorizontalStepKeys(ev)),
			this.value.rawValue.y +
				getStepForKey(this.baseSteps_[1], getVerticalStepKeys(ev)) *
					(this.invertsY_ ? 1 : -1),
		);
	}
}
