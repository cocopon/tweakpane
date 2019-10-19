import {TypeUtil} from '../misc/type-util';
import {Point2d} from '../model/point-2d';
import {Parser} from './parser';

/**
 * @hidden
 */
export const AnyPoint2dParser: Parser<any, Point2d> = (
	obj: any,
): Point2d | null => {
	if (TypeUtil.isEmpty(obj)) {
		return null;
	}

	const x = obj.x;
	const y = obj.y;
	if (typeof x !== 'number' || typeof y !== 'number') {
		return null;
	}

	return new Point2d(x, y);
};
