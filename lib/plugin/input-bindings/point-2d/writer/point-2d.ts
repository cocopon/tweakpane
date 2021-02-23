import {BindingTarget} from '../../../common/binding/target';
import {Point2d} from '../model/point-2d';

export function writePoint2d(target: BindingTarget, value: Point2d) {
	target.writeProperty('x', value.x);
	target.writeProperty('y', value.y);
}
