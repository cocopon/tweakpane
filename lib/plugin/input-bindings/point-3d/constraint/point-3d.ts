import {Constraint} from '../../../common/constraint/constraint';
import {Point3d} from '../model/point-3d';

interface Config {
	x?: Constraint<number> | undefined;
	y?: Constraint<number> | undefined;
	z?: Constraint<number> | undefined;
}

/**
 * @hidden
 */
export class Point3dConstraint implements Constraint<Point3d> {
	public readonly x: Constraint<number> | undefined;
	public readonly y: Constraint<number> | undefined;
	public readonly z: Constraint<number> | undefined;

	constructor(config: Config) {
		this.x = config.x;
		this.y = config.y;
		this.z = config.z;
	}

	public constrain(value: Point3d): Point3d {
		return new Point3d(
			this.x ? this.x.constrain(value.x) : value.x,
			this.y ? this.y.constrain(value.y) : value.y,
			this.z ? this.z.constrain(value.z) : value.z,
		);
	}
}
