import {ValueController} from '../../../common/controller/value';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {createValue} from '../../../common/model/values';
import {ViewProps} from '../../../common/model/view-props';
import {NumberTextController} from '../../../common/number/controller/number-text';
import {PointAxis} from '../../../common/point-nd/point-axis';
import {PointNdAssembly} from '../model/point-nd';
import {PointNdTextView} from '../view/point-nd-text';

interface Config<PointNd> {
	assembly: PointNdAssembly<PointNd>;
	axes: PointAxis[];
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
	implements ValueController<PointNd, PointNdTextView>
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
				forward: (p) => config.assembly.toComponents(p)[index],
				backward: (p, s) => {
					const comps = config.assembly.toComponents(p);
					comps[index] = s;
					return config.assembly.fromComponents(comps);
				},
			});
		});

		this.view = new PointNdTextView(doc, {
			textViews: this.acs_.map((ac) => ac.view),
		});
	}

	get textControllers(): NumberTextController[] {
		return this.acs_;
	}
}
