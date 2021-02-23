import {Target} from '../../../common/model/target';
import {Point2d} from '../model/point-2d';

export function writePoint2d(target: Target, value: Point2d) {
	target.writeProperty('x', value.x);
	target.writeProperty('y', value.y);
}
