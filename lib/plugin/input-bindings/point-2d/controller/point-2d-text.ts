import {Constraint} from '../../../common/constraint/constraint';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {connect} from '../../../common/model/value-sync';
import {NumberTextController} from '../../number/controller/number-text';
import {Point2dConstraint} from '../constraint/point-2d';
import {Point2d} from '../model/point-2d';
import {Point2dTextView} from '../view/point-2d-text';

interface Axis {
	baseStep: number;
	draggingScale: number;
	formatter: Formatter<number>;
}

interface Config {
	axes: [Axis, Axis];
	parser: Parser<number>;
	value: Value<Point2d>;
}

function findAxisConstraint(
	config: Config,
	index: number,
): Constraint<number> | undefined {
	const pc = config.value.constraint;
	if (!(pc instanceof Point2dConstraint)) {
		return undefined;
	}
	return [pc.x, pc.y][index];
}

function createAxisController(
	doc: Document,
	config: Config,
	index: number,
): NumberTextController {
	return new NumberTextController(doc, {
		arrayPosition: index === 0 ? 'fst' : 'lst',
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
export class Point2dTextController implements ValueController<Point2d> {
	public readonly value: Value<Point2d>;
	public readonly view: Point2dTextView;
	private readonly acs_: [NumberTextController, NumberTextController];

	constructor(doc: Document, config: Config) {
		this.value = config.value;

		this.acs_ = [
			createAxisController(doc, config, 0),
			createAxisController(doc, config, 1),
		];
		this.acs_.forEach((c, index) => {
			connect({
				primary: this.value,
				secondary: c.value,
				forward: (p) => {
					return p.rawValue.getComponents()[index];
				},
				backward: (p, s) => {
					const comps = p.rawValue.getComponents();
					comps[index] = s.rawValue;
					return new Point2d(comps[0], comps[1]);
				},
			});
		});

		this.view = new Point2dTextView(doc, {
			textViews: [this.acs_[0].view, this.acs_[1].view],
			value: this.value,
		});
	}
}
