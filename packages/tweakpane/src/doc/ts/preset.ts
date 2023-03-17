import {BladeState} from '@tweakpane/core';

export interface PresetObject {
	[key: string]: unknown;
}

export function stateToPreset(state: BladeState): PresetObject {
	// Container
	if ('children' in state && Array.isArray(state.children)) {
		return state.children.reduce((tmp: PresetObject, substate) => {
			return {
				...tmp,
				...stateToPreset(substate),
			};
		}, {});
	}
	// Binding
	const binding = (state.binding ?? {}) as Record<string, unknown>;
	if (
		'key' in binding &&
		typeof binding.key === 'string' &&
		'value' in binding
	) {
		return {
			[binding.key]: binding.value,
		};
	}
	return {};
}

export function presetToState(
	state: BladeState,
	preset: PresetObject,
): BladeState {
	// Container
	if ('children' in state && Array.isArray(state.children)) {
		return {
			...state,
			children: state.children.map((substate) =>
				presetToState(substate, preset),
			),
		};
	}
	// Binding
	const binding = (state.binding ?? {}) as Record<string, unknown>;
	if (
		'key' in binding &&
		typeof binding.key === 'string' &&
		'value' in binding
	) {
		return {
			...state,
			binding: {
				...binding,
				value: preset[binding.key] ?? state.value,
			},
		};
	}
	return state;
}
