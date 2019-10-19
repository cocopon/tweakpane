export interface Point2dObject {
	x: number;
	y: number;
}

export class Point2d {
	public x: number;
	public y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	public getComponents(): [number, number] {
		return [this.x, this.y];
	}

	public toObject(): Point2dObject {
		return {
			x: this.x,
			y: this.y,
		};
	}
}
