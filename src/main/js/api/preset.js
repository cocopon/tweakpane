// @flow

import Target from '../model/target';

export type PresetObject = {[string]: mixed};

export function exportJson(targets: Target[]): PresetObject {
	return targets.reduce((result, target) => {
		return Object.assign(result, {
			[target.presetKey]: target.read(),
		});
	}, {});
}

export function importJson(targets: Target[], preset: PresetObject): void {
	targets.forEach((target) => {
		const value = preset[target.presetKey];
		if (value !== undefined) {
			target.write(value);
		}
	});
}
