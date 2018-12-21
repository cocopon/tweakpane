// @flow

import Target from '../model/target';

export interface PresetObject {
	[key: string]: unknown;
}

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
