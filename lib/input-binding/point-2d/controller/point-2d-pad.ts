import {ValueController} from '../../../common/controller/value';
import {findNextTarget, supportsTouch} from '../../../common/dom-util';
import {PrimitiveValue} from '../../../common/model/primitive-value';
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
	maxValue: number;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class Point2dPadController implements ValueController<Point2d> {
	public readonly expanded: PrimitiveValue<boolean>;
	public readonly value: Value<Point2d>;
	public readonly view: Point2dPadView;
	public readonly viewProps: ViewProps;
	public triggerElement: HTMLElement | null = null;
	private readonly baseSteps_: [number, number];
	private readonly ptHandler_: PointerHandler;
	private readonly invertsY_: boolean;
	private readonly maxValue_: number;

	constructor(doc: Document, config: Config) {
		this.onFocusableElementBlur_ = this.onFocusableElementBlur_.bind(this);
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.expanded = new PrimitiveValue(false as boolean);
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.baseSteps_ = config.baseSteps;
		this.maxValue_ = config.maxValue;
		this.invertsY_ = config.invertsY;

		this.view = new Point2dPadView(doc, {
			expanded: this.expanded,
			invertsY: this.invertsY_,
			maxValue: this.maxValue_,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.ptHandler_ = new PointerHandler(this.view.padElement);
		this.ptHandler_.emitter.on('down', this.onPointerDown_);
		this.ptHandler_.emitter.on('move', this.onPointerMove_);
		this.ptHandler_.emitter.on('up', this.onPointerUp_);

		this.view.padElement.addEventListener('keydown', this.onPadKeyDown_);

		this.view.element.addEventListener('keydown', this.onKeyDown_);
		this.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onFocusableElementBlur_);
		});
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

	private onFocusableElementBlur_(ev: FocusEvent): void {
		const elem = this.view.element;
		const nextTarget = findNextTarget(ev);
		if (nextTarget && elem.contains(nextTarget)) {
			// Next target is in the picker
			return;
		}
		if (
			nextTarget &&
			nextTarget === this.triggerElement &&
			!supportsTouch(elem.ownerDocument)
		) {
			// Next target is the trigger button
			return;
		}

		this.expanded.rawValue = false;
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		if (ev.key === 'Escape') {
			this.expanded.rawValue = false;
		}
	}
}
