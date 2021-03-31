import {BindingTarget} from '../../../common/binding/target';

export interface PresetObject {
	[key: string]: unknown;
}

/**
 * @hidden
 */
export function exportPresetJson(targets: BindingTarget[]): PresetObject {
	return targets.reduce((result, target) => {
		return Object.assign(result, {
			[target.presetKey]: target.read(),
		});
	}, {});
}

/**
 * @hidden
 */
export function importPresetJson(
	targets: BindingTarget[],
	preset: PresetObject,
): void {
	targets.forEach((target) => {
		const value = preset[target.presetKey];
		if (value !== undefined) {
			target.write(value);
		}
	});
}
