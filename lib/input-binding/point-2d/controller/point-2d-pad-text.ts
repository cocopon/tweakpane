import {PickerLayout} from '../../../blade/common/api/types';
import {Constraint} from '../../../common/constraint/constraint';
import {PopupController} from '../../../common/controller/popup';
import {ValueController} from '../../../common/controller/value';
import {Parser} from '../../../common/converter/parser';
import {findNextTarget, supportsTouch} from '../../../common/dom-util';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextProps} from '../../../common/number/view/number-text';
import {forceCast} from '../../../misc/type-util';
import {PointNdTextController} from '../../common/controller/point-nd-text';
import {Point2d, Point2dAssembly} from '../model/point-2d';
import {Point2dView} from '../view/point-2d-pad-text';
import {Point2dPickerController} from './point-2d-pad';

interface Axis {
	baseStep: number;
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}

interface Config {
	axes: [Axis, Axis];
	invertsY: boolean;
	maxValue: number;
	parser: Parser<number>;
	pickerLayout: PickerLayout;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class Point2dController implements ValueController<Point2d> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dView;
	public readonly viewProps: ViewProps;
	private readonly popC_: PopupController;
	private readonly pickerC_: Point2dPickerController;
	private readonly textIc_: PointNdTextController<Point2d>;

	constructor(doc: Document, config: Config) {
		this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
		this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
		this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
		this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;

		this.popC_ = new PopupController(doc, {
			viewProps: this.viewProps,
		});

		const padC = new Point2dPickerController(doc, {
			baseSteps: [config.axes[0].baseStep, config.axes[1].baseStep],
			invertsY: config.invertsY,
			layout: config.pickerLayout,
			maxValue: config.maxValue,
			value: this.value,
			viewProps: this.viewProps,
		});
		padC.view.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onPopupChildBlur_);
			elem.addEventListener('keydown', this.onPopupChildKeydown_);
		});
		this.pickerC_ = padC;

		this.textIc_ = new PointNdTextController(doc, {
			assembly: Point2dAssembly,
			axes: config.axes,
			parser: config.parser,
			value: this.value,
			viewProps: this.viewProps,
		});

		this.view = new Point2dView(doc, {
			pickerLayout: config.pickerLayout,
			viewProps: this.viewProps,
		});
		this.view.element.appendChild(this.popC_.view.element);
		this.view.textElement.appendChild(this.textIc_.view.element);
		this.view.buttonElement?.addEventListener('blur', this.onPadButtonBlur_);
		this.view.buttonElement?.addEventListener('click', this.onPadButtonClick_);

		if (config.pickerLayout === 'inline') {
			this.view.pickerElement?.appendChild(this.pickerC_.view.element);
		} else {
			this.popC_.view.element.appendChild(this.pickerC_.view.element);
		}
	}

	private onPadButtonBlur_(e: FocusEvent) {
		const elem = this.view.element;
		const nextTarget: HTMLElement | null = forceCast(e.relatedTarget);
		if (!nextTarget || !elem.contains(nextTarget)) {
			this.popC_.shows.rawValue = false;
		}
	}

	private onPadButtonClick_(): void {
		this.popC_.shows.rawValue = !this.popC_.shows.rawValue;
		if (this.popC_.shows.rawValue) {
			this.pickerC_.view.allFocusableElements[0].focus();
		}
	}

	private onPopupChildBlur_(ev: FocusEvent): void {
		const elem = this.popC_.view.element;
		const nextTarget = findNextTarget(ev);
		if (nextTarget && elem.contains(nextTarget)) {
			// Next target is in the popup
			return;
		}
		if (
			nextTarget &&
			nextTarget === this.view.buttonElement &&
			!supportsTouch(elem.ownerDocument)
		) {
			// Next target is the trigger button
			return;
		}

		this.popC_.shows.rawValue = false;
	}

	private onPopupChildKeydown_(ev: KeyboardEvent): void {
		if (ev.key === 'Escape') {
			this.popC_.shows.rawValue = false;
		}
	}
}
