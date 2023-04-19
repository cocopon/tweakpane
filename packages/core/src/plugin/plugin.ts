import {Semver} from '../misc/semver.js';

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
	 * The custom CSS for the plugin.
	 */
	css?: string;

	/**
	 * The version of the core used for this plugin.
	 */
	core?: Semver;
}
