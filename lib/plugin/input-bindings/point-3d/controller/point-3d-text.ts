import {Constraint} from '../../../common/constraint/constraint';
import {ValueController} from '../../../common/controller/value';
import {Formatter} from '../../../common/converter/formatter';
import {Parser} from '../../../common/converter/parser';
import {Value} from '../../../common/model/value';
import {connectValues} from '../../../common/model/value-sync';
import {NumberTextController} from '../../number/controller/number-text';
import {Point3dConstraint} from '../constraint/point-3d';
import {Point3d} from '../model/point-3d';
import {Point3dTextView} from '../view/point-3d-text';

interface Axis {
	baseStep: number;
	draggingScale: number;
	formatter: Formatter<number>;
}

interface Config {
	axes: [Axis, Axis, Axis];
	parser: Parser<number>;
	value: Value<Point3d>;
}

function findAxisConstraint(
	config: Config,
	index: number,
): Constraint<number> | undefined {
	const pc = config.value.constraint;
	if (!(pc instanceof Point3dConstraint)) {
		return undefined;
	}
	return [pc.x, pc.y, pc.z][index];
}

function createAxisController(
	doc: Document,
	config: Config,
	index: number,
): NumberTextController {
	return new NumberTextController(doc, {
		arrayPosition: index === 0 ? 'fst' : index === 3 - 1 ? 'lst' : 'mid',
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
export class Point3dTextController implements ValueController<Point3d> {
	public readonly value: Value<Point3d>;
	public readonly view: Point3dTextView;
	private readonly acs_: [
		NumberTextController,
		NumberTextController,
		NumberTextController,
	];

	constructor(doc: Document, config: Config) {
		this.value = config.value;

		this.acs_ = [
			createAxisController(doc, config, 0),
			createAxisController(doc, config, 1),
			createAxisController(doc, config, 2),
		];

		this.view = new Point3dTextView(doc, {
			textViews: [this.acs_[0].view, this.acs_[1].view, this.acs_[2].view],
			value: this.value,
		});
		this.acs_.forEach((c, index) => {
			connectValues({
				primary: this.value,
				secondary: c.value,
				forward: (p) => {
					return p.rawValue.getComponents()[index];
				},
				backward: (p, s) => {
					const comps = p.rawValue.getComponents();
					comps[index] = s.rawValue;
					return new Point3d(comps[0], comps[1], comps[2]);
				},
			});
		});
	}
}
