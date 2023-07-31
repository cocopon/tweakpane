import {Semver} from '../misc/semver.js';
import {VERSION} from '../version.js';

export type PluginType = 'blade' | 'input' | 'monitor';

/**
 * A base interface of the plugin.
 */
export interface BasePlugin {
	/**
	 * The identifier of the plugin.
	 */
	id: string;

	/**
	 * The type of the plugin.
	 */
	type: PluginType;

	/**
	 * The version of the core used for this plugin.
	 */
	core?: Semver;
}

/**
 * Creates a plugin with the current core.
 * @param plugin The plugin without the core version.
 * @return A plugin with the core version.
 */
export function createPlugin<P extends BasePlugin>(plugin: Omit<P, 'core'>): P {
	return {
		core: VERSION,
		...plugin,
	} as P;
}
