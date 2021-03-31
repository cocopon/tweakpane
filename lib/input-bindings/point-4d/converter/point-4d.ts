import {BindingTarget} from '../../../common/binding/target';
import {Point4d} from '../model/point-4d';

/**
 * @hidden
 */
export function point4dFromUnknown(value: unknown): Point4d {
	return Point4d.isObject(value)
		? new Point4d(value.x, value.y, value.z, value.w)
		: new Point4d();
}

export function writePoint4d(target: BindingTarget, value: Point4d) {
	target.writeProperty('x', value.x);
	target.writeProperty('y', value.y);
	target.writeProperty('z', value.z);
	target.writeProperty('w', value.w);
}
