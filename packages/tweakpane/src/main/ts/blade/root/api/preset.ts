import {Binding} from '@tweakpane/core';

export interface PresetObject {
	[key: string]: unknown;
}

/**
 * @hidden
 */
export function exportPresetJson(bindings: Binding[]): PresetObject {
	return bindings.reduce((result, b) => {
		return Object.assign(result, {
			[b.presetKey]: b.target.read(),
		});
	}, {});
}

/**
 * @hidden
 */
export function importPresetJson(
	bindings: Binding[],
	preset: PresetObject,
): void {
	bindings.forEach((b) => {
		const value = preset[b.presetKey];
		if (value !== undefined) {
			b.target.write(value);
		}
	});
}
