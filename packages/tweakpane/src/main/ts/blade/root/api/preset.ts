import {BindingTarget, InputBinding} from '@tweakpane/core';

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
	bindings: InputBinding<unknown>[],
	preset: PresetObject,
): void {
	bindings.forEach((binding) => {
		const value = preset[binding.target.presetKey];
		if (value !== undefined) {
			binding.writer(binding.target, binding.reader(value));
		}
	});
}
