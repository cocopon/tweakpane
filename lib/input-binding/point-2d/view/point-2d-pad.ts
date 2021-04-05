import {SVG_NS} from '../../../common/dom-util';
import {PrimitiveValue} from '../../../common/model/primitive-value';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {mapRange} from '../../../common/number-util';
import {ClassName} from '../../../common/view/class-name';
import {bindTabIndex} from '../../../common/view/reactive';
import {View} from '../../../common/view/view';
import {Point2d} from '../model/point-2d';

interface Config {
	expanded: PrimitiveValue<boolean>;
	invertsY: boolean;
	maxValue: number;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

const className = ClassName('p2dpad');

/**
 * @hidden
 */
export class Point2dPadView implements View {
	public readonly element: HTMLElement;
	public readonly padElement: HTMLDivElement;
	public readonly value: Value<Point2d>;
	private readonly expanded_: PrimitiveValue<boolean>;
	private readonly invertsY_: boolean;
	private readonly maxValue_: number;
	private svgElem_: Element;
	private lineElem_: Element;
	private markerElem_: Element;

	constructor(doc: Document, config: Config) {
		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.expanded_ = config.expanded;
		this.expanded_.emitter.on('change', this.onFoldableChange_);

		this.invertsY_ = config.invertsY;
		this.maxValue_ = config.maxValue;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const padElem = doc.createElement('div');
		padElem.classList.add(className('p'));
		bindTabIndex(config.viewProps, padElem);
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

		this.update_();
	}

	get allFocusableElements(): HTMLElement[] {
		return [this.padElement];
	}

	private update_(): void {
		if (this.expanded_.rawValue) {
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
		this.update_();
	}

	private onFoldableChange_(): void {
		this.update_();
	}
}
