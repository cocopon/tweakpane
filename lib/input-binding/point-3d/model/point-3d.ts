import {isEmpty} from '../../../misc/type-util';
import {PointNdAssembly} from '../../common/model/point-nd';

export interface Point3dObject {
	x: number;
	y: number;
	z: number;
}

export class Point3d {
	public x: number;
	public y: number;
	public z: number;

	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public getComponents(): [number, number, number] {
		return [this.x, this.y, this.z];
	}

	public static isObject(obj: any): obj is Point3dObject {
		if (isEmpty(obj)) {
			return false;
		}

		const x = obj.x;
		const y = obj.y;
		const z = obj.z;
		if (
			typeof x !== 'number' ||
			typeof y !== 'number' ||
			typeof z !== 'number'
		) {
			return false;
		}

		return true;
	}

	public static equals(v1: Point3d, v2: Point3d): boolean {
		return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
	}

	public toObject(): Point3dObject {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
		};
	}
}

export const Point3dAssembly: PointNdAssembly<Point3d> = {
	toComponents: (p: Point3d) => p.getComponents(),
	fromComponents: (comps: number[]) => new Point3d(...comps),
};
