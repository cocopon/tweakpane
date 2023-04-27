import {ValueController} from '../../../common/controller/value.js';
import {Value, ValueChangeOptions} from '../../../common/model/value.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {mapRange} from '../../../common/number/util.js';
import {PickerLayout} from '../../../common/params.js';
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
import {Tuple2} from '../../../misc/type-util.js';
import {Point2d} from '../model/point-2d.js';
import {
	Point2dPickerProps,
	Point2dPickerView,
} from '../view/point-2d-picker.js';

interface Config {
	layout: PickerLayout;
	props: Point2dPickerProps;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

function computeOffset(
	ev: KeyboardEvent,
	keyScales: Tuple2<number>,
	invertsY: boolean,
): [number, number] {
	return [
		getStepForKey(keyScales[0], getHorizontalStepKeys(ev)),
		getStepForKey(keyScales[1], getVerticalStepKeys(ev)) * (invertsY ? 1 : -1),
	];
}

/**
 * @hidden
 */
export class Point2dPickerController
	implements ValueController<Point2d, Point2dPickerView>
{
	public readonly props: Point2dPickerProps;
	public readonly value: Value<Point2d>;
	public readonly view: Point2dPickerView;
	public readonly viewProps: ViewProps;
	private readonly ptHandler_: PointerHandler;

	constructor(doc: Document, config: Config) {
		this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
		this.onPadKeyUp_ = this.onPadKeyUp_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.props = config.props;
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new Point2dPickerView(doc, {
			layout: config.layout,
			props: this.props,
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

		const max = this.props.get('max');
		const px = mapRange(d.point.x, 0, d.bounds.width, -max, +max);
		const py = mapRange(
			this.props.get('invertsY') ? d.bounds.height - d.point.y : d.point.y,
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

		const [dx, dy] = computeOffset(
			ev,
			[this.props.get('xKeyScale'), this.props.get('yKeyScale')],
			this.props.get('invertsY'),
		);
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
		const [dx, dy] = computeOffset(
			ev,
			[this.props.get('xKeyScale'), this.props.get('yKeyScale')],
			this.props.get('invertsY'),
		);
		if (dx === 0 && dy === 0) {
			return;
		}

		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		});
	}
}
