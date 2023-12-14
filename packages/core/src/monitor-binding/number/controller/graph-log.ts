import {BufferedValueController} from '../../../blade/binding/controller/monitor-binding.js';
import {
	BladeState,
	exportBladeState,
	importBladeState,
	PropsPortable,
} from '../../../blade/common/controller/blade-state.js';
import {Formatter} from '../../../common/converter/formatter.js';
import {supportsTouch} from '../../../common/dom-util.js';
import {BufferedValue} from '../../../common/model/buffered-value.js';
import {Value} from '../../../common/model/value.js';
import {createValue} from '../../../common/model/values.js';
import {ViewProps} from '../../../common/model/view-props.js';
import {mapRange} from '../../../common/number/util.js';
import {
	PointerHandler,
	PointerHandlerEvent,
} from '../../../common/view/pointer-handler.js';
import {GraphLogProps, GraphLogView} from '../view/graph-log.js';

interface Config {
	formatter: Formatter<number>;
	props: GraphLogProps;
	rows: number;
	value: BufferedValue<number>;
	viewProps: ViewProps;
}

/**
 * @hidden
 */
export class GraphLogController
	implements BufferedValueController<number, GraphLogView>, PropsPortable
{
	public readonly props: GraphLogProps;
	public readonly value: BufferedValue<number>;
	public readonly view: GraphLogView;
	public readonly viewProps: ViewProps;
	private readonly cursor_: Value<number>;

	constructor(doc: Document, config: Config) {
		this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
		this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
		this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
		this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
		this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);

		this.props = config.props;
		this.value = config.value;
		this.viewProps = config.viewProps;
		this.cursor_ = createValue(-1);

		this.view = new GraphLogView(doc, {
			cursor: this.cursor_,
			formatter: config.formatter,
			rows: config.rows,
			props: this.props,
			value: this.value,
			viewProps: this.viewProps,
		});

		if (!supportsTouch(doc)) {
			this.view.element.addEventListener('mousemove', this.onGraphMouseMove_);
			this.view.element.addEventListener('mouseleave', this.onGraphMouseLeave_);
		} else {
			const ph = new PointerHandler(this.view.element);
			ph.emitter.on('down', this.onGraphPointerDown_);
			ph.emitter.on('move', this.onGraphPointerMove_);
			ph.emitter.on('up', this.onGraphPointerUp_);
		}
	}

	public importProps(state: BladeState): boolean {
		return importBladeState(
			state,
			null,
			(p) => ({
				max: p.required.number,
				min: p.required.number,
			}),
			(result) => {
				this.props.set('max', result.max);
				this.props.set('min', result.min);
				return true;
			},
		);
	}

	public exportProps(): BladeState {
		return exportBladeState(null, {
			max: this.props.get('max'),
			min: this.props.get('min'),
		});
	}

	private onGraphMouseLeave_(): void {
		this.cursor_.rawValue = -1;
	}

	private onGraphMouseMove_(ev: MouseEvent): void {
		const {clientWidth: w} = this.view.element;

		this.cursor_.rawValue = Math.floor(
			mapRange(ev.offsetX, 0, w, 0, this.value.rawValue.length),
		);
	}

	private onGraphPointerDown_(ev: PointerHandlerEvent): void {
		this.onGraphPointerMove_(ev);
	}

	private onGraphPointerMove_(ev: PointerHandlerEvent): void {
		if (!ev.data.point) {
			this.cursor_.rawValue = -1;
			return;
		}

		this.cursor_.rawValue = Math.floor(
			mapRange(
				ev.data.point.x,
				0,
				ev.data.bounds.width,
				0,
				this.value.rawValue.length,
			),
		);
	}

	private onGraphPointerUp_(): void {
		this.cursor_.rawValue = -1;
	}
}
