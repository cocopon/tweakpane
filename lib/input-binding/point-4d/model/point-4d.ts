import {isEmpty, Tuple4} from '../../../misc/type-util';
import {PointNdAssembly} from '../../common/model/point-nd';

export interface Point4dObject {
	x: number;
	y: number;
	z: number;
	w: number;
}

export class Point4d {
	public x: number;
	public y: number;
	public z: number;
	public w: number;

	constructor(x = 0, y = 0, z = 0, w = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}

	public getComponents(): Tuple4<number> {
		return [this.x, this.y, this.z, this.w];
	}

	public static isObject(obj: any): obj is Point4dObject {
		if (isEmpty(obj)) {
			return false;
		}

		const x = obj.x;
		const y = obj.y;
		const z = obj.z;
		const w = obj.w;
		if (
			typeof x !== 'number' ||
			typeof y !== 'number' ||
			typeof z !== 'number' ||
			typeof w !== 'number'
		) {
			return false;
		}

		return true;
	}

	public static equals(v1: Point4d, v2: Point4d): boolean {
		return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
	}

	public toObject(): Point4dObject {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
			w: this.w,
		};
	}
}

export const Point4dAssembly: PointNdAssembly<Point4d> = {
	toComponents: (p: Point4d) => p.getComponents(),
	fromComponents: (comps: number[]) => new Point4d(...comps),
};
