import {Constraint} from '../../../common/constraint/constraint';
import {ValueController} from '../../../common/controller/value';
import {Parser} from '../../../common/converter/parser';
import {BoundValue} from '../../../common/model/bound-value';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {NumberTextProps} from '../../../common/number/view/number-text';
import {PointNdAssembly} from '../model/point-nd';
import {PointNdTextView} from '../view/point-nd-text';

interface Axis {
	baseStep: number;
	constraint: Constraint<number> | undefined;
	textProps: NumberTextProps;
}

interface Config<PointNd> {
	assembly: PointNdAssembly<PointNd>;
	axes: Axis[];
	parser: Parser<number>;
	value: Value<PointNd>;
	viewProps: ViewProps;
}

function createAxisController<PointNd>(
	doc: Document,
	config: Config<PointNd>,
	index: number,
): NumberTextController {
	return new NumberTextController(doc, {
		arrayPosition:
			index === 0 ? 'fst' : index === config.axes.length - 1 ? 'lst' : 'mid',
		baseStep: config.axes[index].baseStep,
		parser: config.parser,
		props: config.axes[index].textProps,
		value: new BoundValue(0, {
			constraint: config.axes[index].constraint,
		}),
		viewProps: config.viewProps,
	});
}

/**
 * @hidden
 */
export class PointNdTextController<PointNd>
	implements ValueController<PointNd> {
	public readonly value: Value<PointNd>;
	public readonly view: PointNdTextView;
	public readonly viewProps: ViewProps;
	private readonly acs_: NumberTextController[];

	constructor(doc: Document, config: Config<PointNd>) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.acs_ = config.axes.map((_, index) =>
			createAxisController(doc, config, index),
		);
		this.acs_.forEach((c, index) => {
			connectValues({
				primary: this.value,
				secondary: c.value,
				forward: (p) => {
					return config.assembly.toComponents(p.rawValue)[index];
				},
				backward: (p, s) => {
					const comps = config.assembly.toComponents(p.rawValue);
					comps[index] = s.rawValue;
					return config.assembly.fromComponents(comps);
				},
			});
		});

		this.view = new PointNdTextView(doc, {
			textViews: this.acs_.map((ac) => ac.view),
		});
	}
}
