import {isEmpty} from '../../../misc/type-util';
import {PointNdAssembly} from '../../common/model/point-nd';

export interface Point2dObject {
	x: number;
	y: number;
}

export class Point2d {
	public x: number;
	public y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	public getComponents(): [number, number] {
		return [this.x, this.y];
	}

	public static isObject(obj: any): obj is Point2dObject {
		if (isEmpty(obj)) {
			return false;
		}

		const x = obj.x;
		const y = obj.y;
		if (typeof x !== 'number' || typeof y !== 'number') {
			return false;
		}

		return true;
	}

	public static equals(v1: Point2d, v2: Point2d): boolean {
		return v1.x === v2.x && v1.y === v2.y;
	}

	public toObject(): Point2dObject {
		return {
			x: this.x,
			y: this.y,
		};
	}
}

export const Point2dAssembly: PointNdAssembly<Point2d> = {
	toComponents: (p: Point2d) => p.getComponents(),
	fromComponents: (comps: number[]) => new Point2d(...comps),
};
