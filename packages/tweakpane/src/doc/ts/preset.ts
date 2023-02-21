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
	if ('key' in state && typeof state.key === 'string' && 'value' in state) {
		return {
			[state.key]: state.value,
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
	if ('key' in state && typeof state.key === 'string' && 'value' in state) {
		return {
			...state,
			value: preset[state.key] ?? state.value,
		};
	}
	return state;
}
