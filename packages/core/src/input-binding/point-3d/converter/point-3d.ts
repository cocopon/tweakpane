import {BindingTarget} from '../../../common/binding/target';
import {Point3d} from '../model/point-3d';

/**
 * @hidden
 */
export function point3dFromUnknown(value: unknown): Point3d {
	return Point3d.isObject(value)
		? new Point3d(value.x, value.y, value.z)
		: new Point3d();
}

export function writePoint3d(target: BindingTarget, value: Point3d) {
	target.writeProperty('x', value.x);
	target.writeProperty('y', value.y);
	target.writeProperty('z', value.z);
}
