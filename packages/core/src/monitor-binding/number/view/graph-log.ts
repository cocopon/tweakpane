import {Formatter} from '../../../common/converter/formatter';
import {forceReflow, SVG_NS} from '../../../common/dom-util';
import {BufferedValue} from '../../../common/model/buffered-value';
import {Value} from '../../../common/model/value';
import {ValueMap} from '../../../common/model/value-map';
import {ViewProps} from '../../../common/model/view-props';
import {mapRange} from '../../../common/number-util';
import {ClassName} from '../../../common/view/class-name';
import {View} from '../../../common/view/view';

export type GraphLogProps = ValueMap<{
	maxValue: number;
	minValue: number;
}>;

interface Config {
	cursor: Value<number>;
	formatter: Formatter<number>;
	lineCount: number;
	props: GraphLogProps;
	value: BufferedValue<number>;
	viewProps: ViewProps;
}

const className = ClassName('grl');

/**
 * @hidden
 */
export class GraphLogView implements View {
	public readonly element: HTMLElement;
	public readonly value: BufferedValue<number>;
	private readonly props_: GraphLogProps;
	private readonly cursor_: Value<number>;
	private readonly formatter_: Formatter<number>;
	private readonly lineElem_: Element;
	private readonly svgElem_: Element;
	private readonly tooltipElem_: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.onCursorChange_ = this.onCursorChange_.bind(this);
		this.onValueUpdate_ = this.onValueUpdate_.bind(this);

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		this.formatter_ = config.formatter;
		this.props_ = config.props;

		this.cursor_ = config.cursor;
		this.cursor_.emitter.on('change', this.onCursorChange_);

		const svgElem = doc.createElementNS(SVG_NS, 'svg');
		svgElem.classList.add(className('g'));
		svgElem.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
		this.element.appendChild(svgElem);
		this.svgElem_ = svgElem;

		const lineElem = doc.createElementNS(SVG_NS, 'polyline');
		this.svgElem_.appendChild(lineElem);
		this.lineElem_ = lineElem;

		const tooltipElem = doc.createElement('div');
		tooltipElem.classList.add(className('t'), ClassName('tt')());
		this.element.appendChild(tooltipElem);
		this.tooltipElem_ = tooltipElem;

		config.value.emitter.on('change', this.onValueUpdate_);
		this.value = config.value;

		this.update_();
	}

	get graphElement(): Element {
		return this.svgElem_;
	}

	private update_(): void {
		const bounds = this.svgElem_.getBoundingClientRect();

		// Graph
		const maxIndex = this.value.rawValue.length - 1;
		const min = this.props_.get('minValue');
		const max = this.props_.get('maxValue');
		const points: string[] = [];
		this.value.rawValue.forEach((v, index) => {
			if (v === undefined) {
				return;
			}
			const x = mapRange(index, 0, maxIndex, 0, bounds.width);
			const y = mapRange(v, min, max, bounds.height, 0);
			points.push([x, y].join(','));
		});
		this.lineElem_.setAttributeNS(null, 'points', points.join(' '));

		// Cursor
		const tooltipElem = this.tooltipElem_;
		const value = this.value.rawValue[this.cursor_.rawValue];
		if (value === undefined) {
			tooltipElem.classList.remove(className('t', 'a'));
			return;
		}

		const tx = mapRange(this.cursor_.rawValue, 0, maxIndex, 0, bounds.width);
		const ty = mapRange(value, min, max, bounds.height, 0);
		tooltipElem.style.left = `${tx}px`;
		tooltipElem.style.top = `${ty}px`;
		tooltipElem.textContent = `${this.formatter_(value)}`;

		if (!tooltipElem.classList.contains(className('t', 'a'))) {
			// Suppresses unwanted initial transition
			tooltipElem.classList.add(className('t', 'a'), className('t', 'in'));
			forceReflow(tooltipElem);
			tooltipElem.classList.remove(className('t', 'in'));
		}
	}

	private onValueUpdate_(): void {
		this.update_();
	}

	private onCursorChange_(): void {
		this.update_();
	}
}
