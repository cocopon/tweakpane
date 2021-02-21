import {disposeElement} from '../../../common/disposing-util';
import {SVG_NS} from '../../../common/dom-util';
import {Foldable} from '../../../common/model/foldable';
import {Point2d} from '../../../common/model/point-2d';
import {Value} from '../../../common/model/value';
import {mapRange} from '../../../common/number-util';
import {PaneError} from '../../../common/pane-error';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {View, ViewConfig} from '../../../common/view/view';

interface Config extends ViewConfig {
	foldable: Foldable;
	invertsY: boolean;
	value: Value<Point2d>;
	maxValue: number;
}

const className = ClassName('p2dpad');

/**
 * @hidden
 */
export class Point2dPadView extends View implements ValueView<Point2d> {
	public readonly foldable: Foldable;
	public readonly value: Value<Point2d>;
	private readonly invertsY_: boolean;
	private readonly maxValue_: number;
	private padElem_: HTMLDivElement | null;
	private svgElem_: Element | null;
	private lineElem_: Element | null;
	private markerElem_: Element | null;

	constructor(document: Document, config: Config) {
		super(document, config);

		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.foldable = config.foldable;
		this.foldable.emitter.on('change', this.onFoldableChange_);

		this.invertsY_ = config.invertsY;
		this.maxValue_ = config.maxValue;

		this.element.classList.add(className());

		const padElem = document.createElement('div');
		padElem.tabIndex = 0;
		padElem.classList.add(className('p'));
		this.element.appendChild(padElem);
		this.padElem_ = padElem;

		const svgElem = document.createElementNS(SVG_NS, 'svg');
		svgElem.classList.add(className('g'));
		this.padElem_.appendChild(svgElem);
		this.svgElem_ = svgElem;

		const xAxisElem = document.createElementNS(SVG_NS, 'line');
		xAxisElem.classList.add(className('ax'));
		xAxisElem.setAttributeNS(null, 'x1', '0');
		xAxisElem.setAttributeNS(null, 'y1', '50%');
		xAxisElem.setAttributeNS(null, 'x2', '100%');
		xAxisElem.setAttributeNS(null, 'y2', '50%');
		this.svgElem_.appendChild(xAxisElem);

		const yAxisElem = document.createElementNS(SVG_NS, 'line');
		yAxisElem.classList.add(className('ax'));
		yAxisElem.setAttributeNS(null, 'x1', '50%');
		yAxisElem.setAttributeNS(null, 'y1', '0');
		yAxisElem.setAttributeNS(null, 'x2', '50%');
		yAxisElem.setAttributeNS(null, 'y2', '100%');
		this.svgElem_.appendChild(yAxisElem);

		const lineElem = document.createElementNS(SVG_NS, 'line');
		lineElem.classList.add(className('l'));
		lineElem.setAttributeNS(null, 'x1', '50%');
		lineElem.setAttributeNS(null, 'y1', '50%');
		this.svgElem_.appendChild(lineElem);
		this.lineElem_ = lineElem;

		const markerElem = document.createElementNS(SVG_NS, 'circle');
		markerElem.classList.add(className('m'));
		markerElem.setAttributeNS(null, 'r', '2px');
		this.svgElem_.appendChild(markerElem);
		this.markerElem_ = markerElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();

		config.model.emitter.on('dispose', () => {
			this.padElem_ = disposeElement(this.padElem_);
		});
	}

	get padElement(): HTMLDivElement {
		if (!this.padElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.padElem_;
	}

	get allFocusableElements(): HTMLElement[] {
		if (!this.padElem_) {
			throw PaneError.alreadyDisposed();
		}
		return [this.padElem_];
	}

	public update(): void {
		if (this.foldable.expanded) {
			this.element.classList.add(className(undefined, 'expanded'));
		} else {
			this.element.classList.remove(className(undefined, 'expanded'));
		}

		const lineElem = this.lineElem_;
		const markerElem = this.markerElem_;
		if (!lineElem || !markerElem) {
			throw PaneError.alreadyDisposed();
		}

		const [x, y] = this.value.rawValue.getComponents();
		const max = this.maxValue_;
		const px = mapRange(x, -max, +max, 0, 100);
		const py = mapRange(y, -max, +max, 0, 100);
		const ipy = this.invertsY_ ? 100 - py : py;
		lineElem.setAttributeNS(null, 'x2', `${px}%`);
		lineElem.setAttributeNS(null, 'y2', `${ipy}%`);
		markerElem.setAttributeNS(null, 'cx', `${px}%`);
		markerElem.setAttributeNS(null, 'cy', `${ipy}%`);
	}

	private onValueChange_(): void {
		this.update();
	}

	private onFoldableChange_(): void {
		this.update();
	}
}
