import {Constraint} from '../../../common/constraint/constraint';
import {Controller} from '../../../common/controller/controller';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {createValue} from '../../../common/model/values';
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
		value: createValue(0, {
			constraint: config.axes[index].constraint,
		}),
		viewProps: config.viewProps,
	});
}

/**
 * @hidden
 */
export class PointNdTextController<PointNd>
	implements Controller<PointNdTextView>
{
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
