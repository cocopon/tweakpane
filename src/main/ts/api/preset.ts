import {Target} from '../plugin/common/model/target';

export interface PresetObject {
	[key: string]: unknown;
}

/**
 * @hidden
 */
export function exportPresetJson(targets: Target[]): PresetObject {
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
	targets: Target[],
	preset: PresetObject,
): void {
	targets.forEach((target) => {
		const value = preset[target.presetKey];
		if (value !== undefined) {
			target.write(value);
		}
	});
}
