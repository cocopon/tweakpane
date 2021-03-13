import {Constraint} from '../../../common/constraint/constraint';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {NumberTextController} from '../../number/controller/number-text';
import {Point2dConstraint} from '../constraint/point-2d';
import {PointNdTextView} from '../view/point-nd-text';

interface Axis {
	baseStep: number;
	draggingScale: number;
	formatter: Formatter<number>;
}

interface Config<PointNd> {
	axes: Axis[];
	convert: {
		toComponents: (p: PointNd) => number[];
		fromComponents: (comps: number[]) => PointNd;
	};
	parser: Parser<number>;
	value: Value<PointNd>;
}

function findAxisConstraint<PointNd>(
	config: Config<PointNd>,
	index: number,
): Constraint<number> | undefined {
	const pc = config.value.constraint;
	if (!(pc instanceof Point2dConstraint)) {
		return undefined;
	}
	return [pc.x, pc.y][index];
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
		formatter: config.axes[index].formatter,
		draggingScale: config.axes[index].draggingScale,
		parser: config.parser,
		value: new Value(0, {
			constraint: findAxisConstraint(config, index),
		}),
	});
}

/**
 * @hidden
 */
export class PointNdTextController<PointNd>
	implements ValueController<PointNd> {
	public readonly value: Value<PointNd>;
	public readonly view: PointNdTextView<PointNd>;
	private readonly acs_: [NumberTextController, NumberTextController];

	constructor(doc: Document, config: Config<PointNd>) {
		this.value = config.value;

		this.acs_ = [
			createAxisController(doc, config, 0),
			createAxisController(doc, config, 1),
		];
		this.acs_.forEach((c, index) => {
			connectValues({
				primary: this.value,
				secondary: c.value,
				forward: (p) => {
					return config.convert.toComponents(p.rawValue)[index];
				},
				backward: (p, s) => {
					const comps = config.convert.toComponents(p.rawValue);
					comps[index] = s.rawValue;
					return config.convert.fromComponents(comps);
				},
			});
		});

		this.view = new PointNdTextView(doc, {
			textViews: this.acs_.map((ac) => ac.view),
			value: this.value,
		});
	}
}