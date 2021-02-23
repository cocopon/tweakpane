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
	public readonly x: Constraint<number> | undefined;
	public readonly y: Constraint<number> | undefined;

	constructor(config: Config) {
		this.x = config.x;
		this.y = config.y;
	}

	public constrain(value: Point2d): Point2d {
		return new Point2d(
			this.x ? this.x.constrain(value.x) : value.x,
			this.y ? this.y.constrain(value.y) : value.y,
		);
	}
}
