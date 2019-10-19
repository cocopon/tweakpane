import {Point2d} from '../model/point-2d';
import {AnyPoint2dParser} from '../parser/any-point-2d';

/**
 * @hidden
 */
export function fromMixed(value: unknown): Point2d {
	return AnyPoint2dParser(value) || new Point2d();
}
