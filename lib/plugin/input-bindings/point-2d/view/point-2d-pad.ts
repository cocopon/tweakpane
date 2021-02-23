import {SVG_NS} from '../../../common/dom-util';
import {Foldable} from '../../../common/model/foldable';
import {Value} from '../../../common/model/value';
import {mapRange} from '../../../common/number-util';
import {ClassName} from '../../../common/view/class-name';
import {ValueView} from '../../../common/view/value';
import {Point2d} from '../model/point-2d';

interface Config {
	foldable: Foldable;
	invertsY: boolean;
	value: Value<Point2d>;
	maxValue: number;
}

const className = ClassName('p2dpad');

/**
 * @hidden
 */
export class Point2dPadView implements ValueView<Point2d> {
	public readonly element: HTMLElement;
	public readonly foldable: Foldable;
	public readonly padElement: HTMLDivElement;
	public readonly value: Value<Point2d>;
	private readonly invertsY_: boolean;
	private readonly maxValue_: number;
	private svgElem_: Element;
	private lineElem_: Element;
	private markerElem_: Element;

	constructor(doc: Document, config: Config) {
		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.foldable = config.foldable;
		this.foldable.emitter.on('change', this.onFoldableChange_);

		this.invertsY_ = config.invertsY;
		this.maxValue_ = config.maxValue;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const padElem = doc.createElement('div');
		padElem.tabIndex = 0;
		padElem.classList.add(className('p'));
		this.element.appendChild(padElem);
		this.padElement = padElem;

		const svgElem = doc.createElementNS(SVG_NS, 'svg');
		svgElem.classList.add(className('g'));
		this.padElement.appendChild(svgElem);
		this.svgElem_ = svgElem;

		const xAxisElem = doc.createElementNS(SVG_NS, 'line');
		xAxisElem.classList.add(className('ax'));
		xAxisElem.setAttributeNS(null, 'x1', '0');
		xAxisElem.setAttributeNS(null, 'y1', '50%');
		xAxisElem.setAttributeNS(null, 'x2', '100%');
		xAxisElem.setAttributeNS(null, 'y2', '50%');
		this.svgElem_.appendChild(xAxisElem);

		const yAxisElem = doc.createElementNS(SVG_NS, 'line');
		yAxisElem.classList.add(className('ax'));
		yAxisElem.setAttributeNS(null, 'x1', '50%');
		yAxisElem.setAttributeNS(null, 'y1', '0');
		yAxisElem.setAttributeNS(null, 'x2', '50%');
		yAxisElem.setAttributeNS(null, 'y2', '100%');
		this.svgElem_.appendChild(yAxisElem);

		const lineElem = doc.createElementNS(SVG_NS, 'line');
		lineElem.classList.add(className('l'));
		lineElem.setAttributeNS(null, 'x1', '50%');
		lineElem.setAttributeNS(null, 'y1', '50%');
		this.svgElem_.appendChild(lineElem);
		this.lineElem_ = lineElem;

		const markerElem = doc.createElementNS(SVG_NS, 'circle');
		markerElem.classList.add(className('m'));
		markerElem.setAttributeNS(null, 'r', '2px');
		this.svgElem_.appendChild(markerElem);
		this.markerElem_ = markerElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update();
	}

	get allFocusableElements(): HTMLElement[] {
		return [this.padElement];
	}

	public update(): void {
		if (this.foldable.expanded) {
			this.element.classList.add(className(undefined, 'expanded'));
		} else {
			this.element.classList.remove(className(undefined, 'expanded'));
		}

		const [x, y] = this.value.rawValue.getComponents();
		const max = this.maxValue_;
		const px = mapRange(x, -max, +max, 0, 100);
		const py = mapRange(y, -max, +max, 0, 100);
		const ipy = this.invertsY_ ? 100 - py : py;
		this.lineElem_.setAttributeNS(null, 'x2', `${px}%`);
		this.lineElem_.setAttributeNS(null, 'y2', `${ipy}%`);
		this.markerElem_.setAttributeNS(null, 'cx', `${px}%`);
		this.markerElem_.setAttributeNS(null, 'cy', `${ipy}%`);
	}

	private onValueChange_(): void {
		this.update();
	}

	private onFoldableChange_(): void {
		this.update();
	}
}
