import {Point2d} from '../model/point-2d';

/**
 * @hidden
 */
export function point2dFromUnknown(value: unknown): Point2d {
	return Point2d.isObject(value)
		? new Point2d(value.x, value.y)
		: new Point2d();
}
