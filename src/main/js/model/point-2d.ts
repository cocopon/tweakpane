import {TypeUtil} from '../misc/type-util';

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
		if (TypeUtil.isEmpty(obj)) {
			return false;
		}

		const x = obj.x;
		const y = obj.y;
		if (typeof x !== 'number' || typeof y !== 'number') {
			return false;
		}

		return true;
	}

	public toObject(): Point2dObject {
		return {
			x: this.x,
			y: this.y,
		};
	}
}
