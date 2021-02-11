import {Point2d} from '../model/point-2d';
import {Parser} from './parser';

/**
 * @hidden
 */
export const AnyPoint2dParser: Parser<any, Point2d> = (
	obj: any,
): Point2d | null => {
	return Point2d.isObject(obj) ? new Point2d(obj.x, obj.y) : null;
};
