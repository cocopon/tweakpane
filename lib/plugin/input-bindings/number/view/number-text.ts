import {SVG_NS} from '../../../common/dom-util';
import {Value, ValueEvents} from '../../../common/model/value';
import {constrainRange} from '../../../common/number-util';
import {ClassName} from '../../../common/view/class-name';
import {Config, TextView} from '../../common/view/text';

const className = ClassName('txt');

interface NumberConfig extends Config<number> {
	dragging: Value<number | null>;
	draggingScale: number;
}

export class NumberTextView extends TextView<number> {
	public readonly knobElement: HTMLElement;
	private readonly dragging_: Value<number | null>;
	private readonly draggingScale_: number;
	private readonly guideBodyElem_: SVGPathElement;
	private readonly guideHeadElem_: SVGPathElement;
	private readonly tooltipElem_: HTMLElement;

	constructor(doc: Document, config: NumberConfig) {
		super(doc, config);

		this.element.classList.add(className(undefined, 'num'));

		this.onDraggingChange_ = this.onDraggingChange_.bind(this);

		this.dragging_ = config.dragging;
		this.draggingScale_ = config.draggingScale;
		this.dragging_.emitter.on('change', this.onDraggingChange_);

		this.element.classList.add(className());
		this.inputElement.classList.add(className('i'));

		const knobElem = doc.createElement('div');
		knobElem.classList.add(className('k'));
		this.element.appendChild(knobElem);
		this.knobElement = knobElem;

		const guideElem = doc.createElementNS(SVG_NS, 'svg');
		guideElem.classList.add(className('g'));
		this.knobElement.appendChild(guideElem);

		const bodyElem = doc.createElementNS(SVG_NS, 'path');
		bodyElem.classList.add(className('gb'));
		guideElem.appendChild(bodyElem);
		this.guideBodyElem_ = bodyElem;

		const headElem = doc.createElementNS(SVG_NS, 'path');
		headElem.classList.add(className('gh'));
		guideElem.appendChild(headElem);
		this.guideHeadElem_ = headElem;

		const tooltipElem = doc.createElement('div');
		tooltipElem.classList.add(ClassName('tt')());
		this.knobElement.appendChild(tooltipElem);
		this.tooltipElem_ = tooltipElem;
	}

	private onDraggingChange_(ev: ValueEvents<number | null>['change']) {
		if (ev.rawValue === null) {
			this.element.classList.remove(className(undefined, 'drg'));
			return;
		}

		this.element.classList.add(className(undefined, 'drg'));

		const x = ev.rawValue / this.draggingScale_;
		const aox = x + (x > 0 ? -1 : x < 0 ? +1 : 0);
		const adx = constrainRange(-aox, -4, +4);
		this.guideHeadElem_.setAttributeNS(
			null,
			'd',
			[`M ${aox + adx},0 L${aox},4 L${aox + adx},8`, `M ${x},-1 L${x},9`].join(
				' ',
			),
		);
		this.guideBodyElem_.setAttributeNS(null, 'd', `M 0,4 L${x},4`);

		const formatter = this.props_.get('formatter');
		this.tooltipElem_.textContent = formatter(this.value.rawValue);
		this.tooltipElem_.style.left = `${x}px`;
	}
}
