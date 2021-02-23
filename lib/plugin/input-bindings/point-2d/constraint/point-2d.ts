import {Constraint} from '../../../common/constraint/constraint';
import {Point2d} from '../model/point-2d';

interface Config {
	x?: Constraint<number> | undefined;
	y?: Constraint<number> | undefined;
}

/**
 * @hidden
 */
export class Point2dConstraint implements Constraint<Point2d> {
	public readonly xConstraint: Constraint<number> | undefined;
	public readonly yConstraint: Constraint<number> | undefined;

	constructor(config: Config) {
		this.xConstraint = config.x;
		this.yConstraint = config.y;
	}

	public constrain(value: Point2d): Point2d {
		return new Point2d(
			this.xConstraint ? this.xConstraint.constrain(value.x) : value.x,
			this.yConstraint ? this.yConstraint.constrain(value.y) : value.y,
		);
	}
}
