import {ClassName} from '../../misc/class-name';
import * as DisposingUtil from '../../misc/disposing-util';
import * as DomUtil from '../../misc/dom-util';
import {NumberUtil} from '../../misc/number-util';
import {PaneError} from '../../misc/pane-error';
import {Foldable} from '../../model/foldable';
import {InputValue} from '../../model/input-value';
import {Point2d} from '../../model/point-2d';
import {View, ViewConfig} from '../view';
import {InputView} from './input';

interface Config extends ViewConfig {
	foldable: Foldable;
	value: InputValue<Point2d>;
	maxValue: number;
}

const SVG_NS = DomUtil.SVG_NS;
const className = ClassName('p2dpad', 'input');

/**
 * @hidden
 */
export class Point2dPadInputView extends View implements InputView<Point2d> {
	public readonly foldable: Foldable;
	public readonly value: InputValue<Point2d>;
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

		this.maxValue_ = config.maxValue;

		this.element.classList.add(className());

		const padElem = document.createElement('div');
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
			this.padElem_ = DisposingUtil.disposeElement(this.padElem_);
		});
	}

	get padElement(): HTMLDivElement {
		if (!this.padElem_) {
			throw PaneError.alreadyDisposed();
		}
		return this.padElem_;
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
		const px = NumberUtil.map(x, -max, +max, 0, 100);
		const py = NumberUtil.map(y, -max, +max, 0, 100);
		lineElem.setAttributeNS(null, 'x2', `${px}%`);
		lineElem.setAttributeNS(null, 'y2', `${py}%`);
		markerElem.setAttributeNS(null, 'cx', `${px}%`);
		markerElem.setAttributeNS(null, 'cy', `${py}%`);
	}

	private onValueChange_(): void {
		this.update();
	}

	private onFoldableChange_(): void {
		this.update();
	}
}
