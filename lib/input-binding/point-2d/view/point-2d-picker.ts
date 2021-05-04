import {SVG_NS} from '../../../common/dom-util';
import {Value} from '../../../common/model/value';
import {ViewProps} from '../../../common/model/view-props';
import {mapRange} from '../../../common/number-util';
import {PickerLayout} from '../../../common/params';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';
import {Point2d} from '../model/point-2d';

interface Config {
	invertsY: boolean;
	layout: PickerLayout;
	maxValue: number;
	value: Value<Point2d>;
	viewProps: ViewProps;
}

const className = ClassName('p2dp');

/**
 * @hidden
 */
export class Point2dPickerView implements View {
	public readonly element: HTMLElement;
	public readonly padElement: HTMLDivElement;
	public readonly value: Value<Point2d>;
	private readonly invertsY_: boolean;
	private readonly maxValue_: number;
	private readonly svgElem_: Element;
	private readonly lineElem_: Element;
	private readonly markerElem_: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.onFoldableChange_ = this.onFoldableChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.invertsY_ = config.invertsY;
		this.maxValue_ = config.maxValue;

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		if (config.layout === 'popup') {
			this.element.classList.add(className(undefined, 'p'));
		}

		const padElem = doc.createElement('div');
		padElem.classList.add(className('p'));
		config.viewProps.bindTabIndex(padElem);
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

		const markerElem = doc.createElement('div');
		markerElem.classList.add(className('m'));
		this.padElement.appendChild(markerElem);
		this.markerElem_ = markerElem;

		config.value.emitter.on('change', this.onValueChange_);
		this.value = config.value;

		this.update_();
	}

	get allFocusableElements(): HTMLElement[] {
		return [this.padElement];
	}

	private update_(): void {
		const [x, y] = this.value.rawValue.getComponents();
		const max = this.maxValue_;
		const px = mapRange(x, -max, +max, 0, 100);
		const py = mapRange(y, -max, +max, 0, 100);
		const ipy = this.invertsY_ ? 100 - py : py;
		this.lineElem_.setAttributeNS(null, 'x2', `${px}%`);
		this.lineElem_.setAttributeNS(null, 'y2', `${ipy}%`);
		this.markerElem_.style.left = `${px}%`;
		this.markerElem_.style.top = `${ipy}%`;
	}

	private onValueChange_(): void {
		this.update_();
	}

	private onFoldableChange_(): void {
		this.update_();
	}
}
