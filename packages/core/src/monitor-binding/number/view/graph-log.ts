import {Formatter} from '../../../common/converter/formatter.js';
import {forceReflow, SVG_NS} from '../../../common/dom-util.js';
import {BufferedValue} from '../../../common/model/buffered-value.js';
import {Value} from '../../../common/model/value.js';
import {ValueMap} from '../../../common/model/value-map.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {mapRange} from '../../../common/number/util.js';
import {ClassName} from '../../../common/view/class-name.js';
import {getCssVar} from '../../../common/view/css-vars.js';
import {View} from '../../../common/view/view.js';

export type GraphLogProps = ValueMap<{
	max: number;
	min: number;
}>;

interface Config {
	cursor: Value<number>;
	formatter: Formatter<number>;
	props: GraphLogProps;
	rows: number;
	value: BufferedValue<number>;
	viewProps: ViewProps;
}

const cn = ClassName('grl');

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
		this.element.classList.add(cn());
		config.viewProps.bindClassModifiers(this.element);

		this.formatter_ = config.formatter;
		this.props_ = config.props;

		this.cursor_ = config.cursor;
		this.cursor_.emitter.on('change', this.onCursorChange_);

		const svgElem = doc.createElementNS(SVG_NS, 'svg');
		svgElem.classList.add(cn('g'));
		svgElem.style.height = `calc(var(${getCssVar('containerUnitSize')}) * ${
			config.rows
		})`;
		this.element.appendChild(svgElem);
		this.svgElem_ = svgElem;

		const lineElem = doc.createElementNS(SVG_NS, 'polyline');
		this.svgElem_.appendChild(lineElem);
		this.lineElem_ = lineElem;

		const tooltipElem = doc.createElement('div');
		tooltipElem.classList.add(cn('t'), ClassName('tt')());
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
		const {clientWidth: w, clientHeight: h} = this.element;

		// Graph
		const maxIndex = this.value.rawValue.length - 1;
		const min = this.props_.get('min');
		const max = this.props_.get('max');
		const points: string[] = [];
		this.value.rawValue.forEach((v, index) => {
			if (v === undefined) {
				return;
			}
			const x = mapRange(index, 0, maxIndex, 0, w);
			const y = mapRange(v, min, max, h, 0);
			points.push([x, y].join(','));
		});
		this.lineElem_.setAttributeNS(null, 'points', points.join(' '));

		// Cursor
		const tooltipElem = this.tooltipElem_;
		const value = this.value.rawValue[this.cursor_.rawValue];
		if (value === undefined) {
			tooltipElem.classList.remove(cn('t', 'a'));
			return;
		}

		const tx = mapRange(this.cursor_.rawValue, 0, maxIndex, 0, w);
		const ty = mapRange(value, min, max, h, 0);
		tooltipElem.style.left = `${tx}px`;
		tooltipElem.style.top = `${ty}px`;
		tooltipElem.textContent = `${this.formatter_(value)}`;

		if (!tooltipElem.classList.contains(cn('t', 'a'))) {
			// Suppresses unwanted initial transition
			tooltipElem.classList.add(cn('t', 'a'), cn('t', 'in'));
			forceReflow(tooltipElem);
			tooltipElem.classList.remove(cn('t', 'in'));
		}
	}

	private onValueUpdate_(): void {
		this.update_();
	}

	private onCursorChange_(): void {
		this.update_();
	}
}
