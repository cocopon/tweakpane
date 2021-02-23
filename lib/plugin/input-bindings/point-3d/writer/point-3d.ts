import {Target} from '../../../common/model/target';
import {Point3d} from '../model/point-3d';

export function writePoint3d(target: Target, value: Point3d) {
	target.writeProperty('x', value.x);
	target.writeProperty('y', value.y);
	target.writeProperty('z', value.z);
}
